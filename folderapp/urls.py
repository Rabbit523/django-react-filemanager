from django.urls import path
from .views import *

urlpatterns = [
    path('get/', GetFolderView.as_view()),
    path('create/', CreateFolderView.as_view())
]
