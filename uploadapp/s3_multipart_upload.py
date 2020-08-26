import os
import boto3
from . import aws_config
from botocore.client import Config
import threading
from boto3.s3.transfer import TransferConfig


# class S3MultipartUpload(object):
#     # AWS throws EntityTooSmall error for parts smaller than 5 MB
#     PART_MINIMUM = int(5e6)

#     def __init__(
#         self, bucket, key, local_path, username, directory,
#             part_size=int(15e6),
#             profile_name=None, region_name="eu-west-1", verbose=False):

#         if directory is None:
#             path = '{}/{}'.format(username, key)
#         else:
#             path = '{}/{}/{}'.format(username, directory, key)
#         self.bucket = bucket
#         self.key = path
#         self.path = local_path
#         self.total_bytes = os.stat(local_path).st_size
#         self.part_bytes = part_size
#         assert part_size > self.PART_MINIMUM
#         assert (self.total_bytes % part_size == 0
#                 or self.total_bytes % part_size > self.PART_MINIMUM)
#         self.s3 = boto3.client(
#             's3',
#             aws_config.REGION,
#             config=Config(s3={'addressing_style': 'path'}),
#             aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
#             aws_secret_access_key=aws_config.AWS_ACCESS_KEY,
#         )
#         if verbose:
#             boto3.set_stream_logger(name="botocore")

#     def abort_all(self):
#         mpus = self.s3.list_multipart_uploads(Bucket=self.bucket)
#         aborted = []
#         print("Aborting", len(mpus), "uploads")
#         if "Uploads" in mpus:
#             for u in mpus["Uploads"]:
#                 upload_id = u["UploadId"]
#                 aborted.append(
#                     self.s3.abort_multipart_upload(
#                         Bucket=self.bucket, Key=self.key, UploadId=upload_id))
#         return aborted

#     def create(self):
#         mpu = self.s3.create_multipart_upload(Bucket=self.bucket, Key=self.key)
#         mpu_id = mpu["UploadId"]
#         return mpu_id

#     def upload(self, mpu_id):
#         parts = []
#         uploaded_bytes = 0
#         with open(self.path, "rb") as f:
#             i = 1
#             while True:
#                 data = f.read(self.part_bytes)
#                 if not len(data):
#                     break

#                 signed_url = self.s3.generate_presigned_url(
#                     ClientMethod='upload_part',
#                     Params={
#                         'Bucket': self.bucket,
#                         'Key': self.key,
#                         'UploadId': mpu_id,
#                         'PartNumber': i})

#                 res = requests.put(signed_url, data=data)
#                 etag = res.headers['ETag']
#                 parts.append({'ETag': etag, 'PartNumber': i})

#                 uploaded_bytes += len(data)
#                 print("{0} of {1} uploaded ({2:.3f}%)".format(
#                     uploaded_bytes, self.total_bytes,
#                     as_percent(uploaded_bytes, self.total_bytes)))
#                 i += 1
#         return parts

#     def complete(self, mpu_id, parts):
#         result = self.s3.complete_multipart_upload(
#             Bucket=self.bucket,
#             Key=self.key,
#             UploadId=mpu_id,
#             MultipartUpload={"Parts": parts})
#         return result

class S3MultipartUpload(object):
    # AWS throws EntityTooSmall error for parts smaller than 5 MB
    PART_MINIMUM = int(5e6)

    def __init__(
        self, bucket, key, local_path, username, directory,
            part_size=int(15e6),
            profile_name=None, region_name="eu-west-1", verbose=False):

        if directory is None:
            path = '{}/{}'.format(username, key)
        else:
            path = '{}/{}/{}'.format(username, directory, key)
        self.bucket = bucket
        self.key = path
        self.path = local_path
        self.total_bytes = os.stat(local_path).st_size
        self.part_bytes = part_size
        self.config = TransferConfig(
            multipart_threshold=1024 * 25, max_concurrency=10,
            multipart_chunksize=1024 * 25, use_threads=True)
        assert part_size > self.PART_MINIMUM
        assert (self.total_bytes % part_size == 0
                or self.total_bytes % part_size > self.PART_MINIMUM)
        self.s3 = boto3.client(
            's3',
            aws_config.REGION,
            config=Config(s3={'addressing_style': 'path'}),
            aws_access_key_id=aws_config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=aws_config.AWS_ACCESS_KEY,
        )
        if verbose:
            boto3.set_stream_logger(name="botocore")

    def multipart_upload_large_file(self):
        try:
            success = self.s3.upload_file(
                self.path,
                self.bucket,
                self.key,
                ExtraArgs={'ACL': 'public-read', 'ContentType': 'text/pdf'},
                Config=self.config,
                Callback=ProgressPercentage(self.path)
            )
            success = True
        except Exception as e:
            print(e)
            success = False
        return success


#  Helper
def as_percent(num, denom):
    return float(num) / float(denom) * 100.0


class ProgressPercentage(object):
    def __init__(self, filename):
        self._filename = filename
        self._size = float(os.path.getsize(filename))
        self._seen_so_far = 0
        self._lock = threading.Lock()

    def __call__(self, bytes_amount):
        #  To simplify we'll assume this is hooked up
        #  to a single filename.
        with self._lock:
            self._seen_so_far += bytes_amount
            percentage = (self._seen_so_far / self._size) * 100
            print(
                "\r%s  %s / %s  (%.2f%%)" % (
                    self._filename, self._seen_so_far, self._size,
                    percentage))
