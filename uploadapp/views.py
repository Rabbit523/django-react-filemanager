# from rest_framework.parsers import FileUploadParser
import os
import boto3
import requests
import logging

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import HttpResponse
from botocore.exceptions import ClientError
from botocore.client import Config
from django.conf import settings
from django.forms.models import model_to_dict

from . import aws_config
from . import config
from .models import File, Folder
from .s3_multipart_upload import S3MultipartUpload


# def some_view(request):
#     qs = SomeModel.objects.all()
#     qs_json = serializers.serialize('json', qs)
#     return HttpResponse(qs_json, content_type='application/json')


def upload_multipart(file, directory, username):

    # path where file can be saved
    file_path = os.path.join(settings.MEDIA_ROOT, file.name)
    default_storage.save(file.name, ContentFile(file.read()))

    mpu = S3MultipartUpload(
        aws_config.BUCKET_NAME,
        file.name,
        file_path,
        username,
        directory
    )
    # # abort all multipart uploads for this bucket (optional, for starting over)
    # mpu.abort_all()
    # # create new multipart upload
    # mpu_id = mpu.create()
    # # upload parts
    # parts = mpu.upload(mpu_id)
    # # complete multipart upload
    # http_response = mpu.complete(mpu_id, parts)
    http_response = 500
    if mpu.multipart_upload_large_file():
        http_response = 200

    default_storage.delete(file_path)
    return http_response


def create_presigned_post(object_name, directory, filetype, username):

    # Generate a presigned S3 POST URL

    s3_client = boto3.client(
        's3',
        aws_config.REGION,
        config=Config(s3={'addressing_style': 'path'}),
        aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=aws_config.AWS_ACCESS_KEY,
    )
    if directory is None:
        path = '{}/{}'.format(username, object_name)
    else:
        path = '{}/{}/{}'.format(username, directory, object_name)

    try:
        response = s3_client.generate_presigned_post(
            Bucket=aws_config.BUCKET_NAME,
            Key=path,
            Fields={"acl": "public-read", "Content-Type": filetype,
                    "success_action_redirect": config.DEV_PATH},
            Conditions=[{"acl": "public-read"}, {"Content-Type": filetype},
                        {"success_action_redirect": config.DEV_PATH}],
            ExpiresIn=3600,
        )
    except ClientError as e:
        logging.error(e)
        return None
    # The response contains the presigned URL and required fields
    return response


def uploadfile_to_s3(file, directory, username):

    # path where file can be saved
    file_path = os.path.join(settings.MEDIA_ROOT, file.name)
    default_storage.save(file.name, ContentFile(file.read()))

    # Generate a presigned S3 POST URL
    response = create_presigned_post(
        file.name, directory, file.content_type, username)
    if response is None:
        return None

    # Demonstrate how another Python program can use the presigned URL to upload a file
    with open(file_path, 'rb') as f:
        files = {'file': (file.name, f)}
        http_response = requests.post(
            response['url'], data=response['fields'], files=files)
        default_storage.delete(file_path)
        return http_response


class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        files = dict((request.data).lists())['file']
        directory = request.data['directory']
        if (directory is None) or (directory == 'null'):
            directory = None
        else:
            directory = request.data['directory']
        token = request.data['token']
        user = Token.objects.get(key=token).user
        flag = 1
        arr = []
        for file in files:
            response = upload_multipart(file, directory, user.username)
            # response = uploadfile_to_s3(file, directory, user.username)
            if response == 200:
                if directory is None:
                    url = 'https://s3.{}.amazonaws.com/{}/{}/{}'.format(
                        aws_config.REGION, aws_config.BUCKET_NAME,
                        user.username, file.name)
                else:
                    url = 'https://s3.{}.amazonaws.com/{}/{}/{}/{}'.format(
                        aws_config.REGION, aws_config.BUCKET_NAME,
                        user.username, directory, file.name)
                file_instance = File.objects.create(
                    path=url,
                    content_type=file.content_type,
                    user=user,
                    name=file.name,
                    directory=directory,
                    size=file.size
                )
                arr.append(model_to_dict(file_instance))
            else:
                flag = 0
        if flag == 1:
            return Response(arr, status=status.HTTP_200_OK)
        else:
            return Response(arr, status=status.HTTP_400_BAD_REQUEST)


class FolderUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        files = dict((request.data).lists())['file']
        token = request.data['token']
        user = Token.objects.get(key=token).user
        parent_id = int(request.data['parent_id'])

        dir_arr = list()
        dir_arr.append(request.data['directory'])
        while parent_id != 0:
            instance = Folder.objects.filter(
                user=user).filter(id=parent_id).first()
            temp = model_to_dict(instance)
            parent_id = temp['parent']
            dir_arr.append(temp['name'])

        length = len(dir_arr)
        directory = ""
        for i in range(length - 1, -1, -1):
            directory += dir_arr[i]
            if i != 0:
                directory += '/'

        # flag = 1
        res_json = None
        for file in files:
            response = upload_multipart(file, directory, user.username)
            # response = uploadfile_to_s3(file, directory, user.username)
            if response == 200:
                url = 'https://s3.{}.amazonaws.com/{}/{}/{}/{}'.format(
                    aws_config.REGION, aws_config.BUCKET_NAME,
                    user.username, directory, file.name)
                File.objects.create(
                    path=url,
                    content_type=file.content_type,
                    user=user,
                    name=file.name,
                    directory=directory,
                    size=file.size
                )
            else:
                return Response(res_json, status=status.HTTP_400_BAD_REQUEST)

        folder_instance = Folder.objects.create(
            name=request.data['directory'], user=user,
            parent=request.data['parent_id'])
        res_json = model_to_dict(folder_instance)
        return Response(res_json, status=status.HTTP_200_OK)


class FileGetView(APIView):

    def post(self, request, *args, **kwargs):
        token = request.data['token']
        user = Token.objects.get(key=token).user

        files_objects = File.objects.filter(
            user=user).filter(directory=None).all()
        res_arr = []
        for file in files_objects:
            res_arr.append(model_to_dict(file))

        return Response(res_arr, status=status.HTTP_200_OK)


class FileByDirectoryGetView(APIView):

    def post(self, request, *args, **kwargs):
        directory = request.data['directory']
        if directory[-1] == "/":
            directory = directory.rstrip('/')

        token = request.data['token']
        user = Token.objects.get(key=token).user

        files_objects = File.objects.filter(
            user=user).filter(directory=directory).all()
        res_arr = []
        for file in files_objects:
            res_arr.append(model_to_dict(file))

        return Response(res_arr, status=status.HTTP_200_OK)
