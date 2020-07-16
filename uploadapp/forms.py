from django import forms

class UploadFileForm(forms.Form):
    _file = forms.FileField()