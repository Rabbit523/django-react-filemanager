from django.urls import path
from .views import FileSignedUrlView,\
    InitiateUploadView,\
    CompleteUploadView, \
    CompleteFolderUploadView, \
    CompleteFileUploadView, \
    FileUploadView, \
    FolderUploadView, \
    FileGetView, \
    FileByDirectoryGetView, \
    FolderSignedUrlView, \
    FileDownloadUrlView

urlpatterns = [
    path('getsignedurl/', FileSignedUrlView.as_view()),
    path('initiateUpload/', InitiateUploadView.as_view()),
    path('completeUpload/', CompleteUploadView.as_view()),
    path('completeFolderUpload/', CompleteFolderUploadView.as_view()),
    path('complete_file_upload/', CompleteFileUploadView.as_view()),
    path('upload/', FileUploadView.as_view()),
    path('upload-folder/', FolderUploadView.as_view()),
    path('get/', FileGetView.as_view()),
    path('get-directory-files', FileByDirectoryGetView.as_view()),
    path('folder-signed-urls/', FolderSignedUrlView.as_view()),
    path('file-signed-url/', FileDownloadUrlView.as_view())
]
