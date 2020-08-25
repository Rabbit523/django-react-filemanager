'''Use this for production'''

from .base import *

DEBUG = True
ALLOWED_HOSTS += ['http://domain.com', '18.183.173.57', '127.0.0.1']
WSGI_APPLICATION = 'backend.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db_name',
        'USER': 'db_user',
        'PASSWORD': 'db_password',
        'HOST': 'localhost',
        'PORT': '',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
