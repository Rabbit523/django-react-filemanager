from django.contrib import admin
from .models import Folders
# Register your models here.


class FoldersAdmin(admin.ModelAdmin):
    pass


admin.site.register(Folders, FoldersAdmin)
