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
from rest_framework.authtoken.models import Token
import simplejson as json
# Create your views here.


class CreateFolderView(APIView):

    def post(self, request, *args, **kwargs):
        # token = request.data['token']
        # user = Token.objects.get(key=token).user

        # files_objects = File.objects.filter(user=user).all()
        res_arr = []
        # for file in files_objects:
        #     res_arr.append(model_to_dict(file))

        return Response(res_arr, status=status.HTTP_200_OK)


class GetFolderView(APIView):

    def post(self, request, *args, **kwargs):
        # token = request.data['token']
        # user = Token.objects.get(key=token).user

        # files_objects = File.objects.filter(user=user).all()
        res_arr = []
        # for file in files_objects:
        #     res_arr.append(model_to_dict(file))

        return Response(res_arr, status=status.HTTP_200_OK)
