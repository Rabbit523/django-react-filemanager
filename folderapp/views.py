import os
import requests

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.forms.models import model_to_dict

from .models import Folders
# Create your views here.


class CreateFolderView(APIView):

    def post(self, request, *args, **kwargs):
        token = request.data['token']
        user = Token.objects.get(key=token).user

        folder_instance = Folders.objects.create(
            name=request.data['name'], user=user, parent=request.data['parent_id'])
        res_json = model_to_dict(folder_instance)
        return Response(res_json, status=status.HTTP_200_OK)


class GetFolderView(APIView):

    def post(self, request, *args, **kwargs):
        token = request.data['token']
        user = Token.objects.get(key=token).user
        folders_objects = Folders.objects.filter(
            user=user).filter(parent=request.data['parent_id']).all()
        res_arr = []
        for item in folders_objects:
            res_arr.append(model_to_dict(item))

        return Response(res_arr, status=status.HTTP_200_OK)


class GetAllFolderView(APIView):

    def post(self, request, *args, **kwargs):
        token = request.data['token']
        user = Token.objects.get(key=token).user
        folders_objects = Folders.objects.filter(user=user).all()
        res_arr = []
        for item in folders_objects:
            res_arr.append(model_to_dict(item))

        return Response(res_arr, status=status.HTTP_200_OK)
