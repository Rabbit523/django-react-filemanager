# from rest_framework.parsers import FileUploadParser
import os
import boto3
import requests

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from botocore.exceptions import ClientError
from botocore.client import Config
from django.conf import settings
from django.forms.models import model_to_dict
import simplejson as json

from . import aws_config
from .models import File, User


def some_view(request):
    qs = SomeModel.objects.all()
    qs_json = serializers.serialize('json', qs)
    return HttpResponse(qs_json, content_type='application/json')


def create_presigned_post(object_name, filetype, username):

    # Generate a presigned S3 POST URL

    s3_client = boto3.client(
        's3',
        aws_config.REGION,
        config=Config(s3={'addressing_style': 'path'}),
        aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=aws_config.AWS_ACCESS_KEY,
    )

    try:
        response = s3_client.generate_presigned_post(
            Bucket=aws_config.BUCKET_NAME,
            Key='uploads/{}/{}'.format(username, object_name),
            Fields={"acl": "public-read", "Content-Type": filetype,
                    "success_action_redirect": "http://127.0.0.1:8000"},
            Conditions=[{"acl": "public-read"}, {"Content-Type": filetype},
                        {"success_action_redirect": "http://127.0.0.1:8000"}],
            ExpiresIn=3600,
        )
    except ClientError as e:
        logging.error(e)
        return None
    # The response contains the presigned URL and required fields
    return response


def uploadfile_to_s3(file, username):

    # path where file can be saved
    file_path = os.path.join(settings.MEDIA_ROOT, file.name)
    default_storage.save(file.name, ContentFile(file.read()))

    # Generate a presigned S3 POST URL
    response = create_presigned_post(file.name, file.content_type, username)
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
        flag = 1
        arr = []
        for file in files:
            response = uploadfile_to_s3(file, 'admin')
            if response.status_code == 200 or response.status_code == 204:
                url = 'https://s3.{}.amazonaws.com/{}/uploads/{}/{}'.format(
                    aws_config.REGION, aws_config.BUCKET_NAME, 'admin', file.name)
                file_instance = File.objects.create(
                    path=url,
                    content_type=file.content_type,
                    user=User.objects.first(),
                    name=file.name,
                    size=file.size
                )
                arr.append(model_to_dict(file_instance))
            else:
                flag = 0
        if flag == 1:
            return Response(arr, status=status.HTTP_200_OK)
        else:
            return Response(arr, status=status.HTTP_400_BAD_REQUEST)


class FileGetView(APIView):

    def get(self, request, *args, **kwargs):
        # File.objects.filter(user=request.user)
        files_objects = File.objects.all()
        res_arr = []
        for file in files_objects:
            res_arr.append(model_to_dict(file))

        return Response(res_arr, status=status.HTTP_200_OK)
