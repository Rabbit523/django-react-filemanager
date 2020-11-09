'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1', '54.238.146.249', '18.183.173.57']
DEBUG = True

WSGI_APPLICATION = 'backend.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Filemanager',
        'USER': 'postgres',
        'PASSWORD': 'superstar1123',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://18.183.173.57'
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
