# Generated by Django 3.0.8 on 2020-07-23 17:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('folderapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='folders',
            name='files',
        ),
    ]