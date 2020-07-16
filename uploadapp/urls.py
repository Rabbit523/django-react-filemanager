from django.urls import path
from .views import *

urlpatterns = [
    path('upload/', FileUploadView.as_view()),
    path('get/', FileGetView.as_view())
]
