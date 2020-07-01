web: gunicorn theprojectname.wsgi --chdir backend --limit-request-line 8188 --log-file -
worker: celery worker --workdir backend --app=theprojectname -B --loglevel=info
