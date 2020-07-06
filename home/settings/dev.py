'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Filemanager',
        'USER': 'sniper',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)
