from django.urls import path
from .views import *

urlpatterns = [
    path('upload/', FileUploadView.as_view()),
    path('upload-folder/', FolderUploadView.as_view()),
    path('get/', FileGetView.as_view()),
    path('get-directory-files', FileByDirectoryGetView.as_view())
]
