from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import File


class FileSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = ["file"]

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)
