from django.db import models
from django import forms
from django.apps import apps as django_apps
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils import timezone


def get_user_model():
    """
    Return the User model that is active in this project.
    """
    try:
        return django_apps.get_model(settings.AUTH_USER_MODEL, require_ready=False)
    except ValueError:
        raise ImproperlyConfigured(
            "AUTH_USER_MODEL must be of the form 'app_label.model_name'")
    except LookupError:
        raise ImproperlyConfigured(
            "AUTH_USER_MODEL refers to model '%s' that has not been installed" % settings.AUTH_USER_MODEL
        )


def get_folder_model():
    """
    Return the User model that is active in this project.
    """
    try:
        return django_apps.get_model(settings.FOLDER_MODEL, require_ready=False)
    except ValueError:
        raise ImproperlyConfigured(
            "AUTH_USER_MODEL must be of the form 'app_label.model_name'")
    except LookupError:
        raise ImproperlyConfigured(
            "AUTH_USER_MODEL refers to model '%s' that has not been installed" % settings.AUTH_USER_MODEL
        )


User = get_user_model()

Folder = get_folder_model()


class File(models.Model):
    path = models.CharField(max_length=255, default='')
    content_type = models.CharField(max_length=255, default='')
    name = models.CharField(max_length=255, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    size = models.CharField(max_length=255, default='')
    directory = models.CharField(max_length=255, default=None, null=True)
    created_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.file.name
