from base64 import decode
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.db import Error, IntegrityError
from django.db.transaction import atomic
from psycopg2 import errorcodes
import json
import sys
import time
from google.cloud import storage

from .models import *

GOOGLE_CLOUD_BUCKET = "notes4alltest"
storage_client = storage.Client()
bucket = storage_client.bucket(GOOGLE_CLOUD_BUCKET)
count = 0

# Warning: Do not use retry_on_exception in an inner nested transaction.

def retry_on_exception(num_retries=3, on_failure=HttpResponse(status=500), delay_=0.5, backoff_=1.5):
    def retry(view):
        def wrapper(*args, **kwargs):
            delay = delay_
            for i in range(num_retries):
                try:
                    return view(*args, **kwargs)
                except IntegrityError as ex:
                    if i == num_retries - 1:
                        return on_failure
                    elif getattr(ex.__cause__, 'pgcode', '') == errorcodes.SERIALIZATION_FAILURE:
                        time.sleep(delay)
                        delay *= backoff_
                except Error as ex:
                    return on_failure
        return wrapper
    return retry


class PingView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("python/django", status=200)

""" pass in the data to save to the cloud bucket and retrieve the blob name """
def encode_google_cloud(name, prefix, data):
    global count
    dest_blob_name = f"notes4all_transcript_{prefix}_{name}"
    print(f"writing to count {dest_blob_name}")
    count = count+1
    blob = bucket.blob(dest_blob_name)
    blob.upload_from_string(data, num_retries=3)
    return dest_blob_name

def decode_google_cloud(name):
    blob = bucket.blob(name)
    return blob.download_as_string()

def assembly_request_summary(audio):
    return "t"

class NotesView(View):
    
    # @retry_on_exception(3)
    def get(self, request, id=None, *args, **kwargs):   
        notes = list(Notes.objects.values())
        if id is not None:
            notes = list(Notes.objects.filter(id=id).values())
        o_notes = []
        for note in notes:
            res = {"title": note["title"], "notes_data": decode_google_cloud(note["note_link"])}
            if "summary_link" in note:
                res["summary_data"] = decode_google_cloud(note["summary_link"])
            o_notes.append(res)
            
        return json.dumps(o_notes)
    
    @retry_on_exception(3)
    @atomic 
    def post(self, request, *args, **kwargs):
        form_data = json.loads(request.body.decode())
        name, notes_data, summary_data = form_data['title'], form_data['notes_data'], None
        if 'summary_data' in form_data:
            summary_data = form_data['summary_data']
            n = Notes(title=name, note_link=encode_google_cloud(name, 'note', notes_data), summary_link=encode_google_cloud(name, 'summary', summary_data))
        else:
            n = Notes(title=name, note_link=encode_google_cloud(name, 'note', notes_data))
        n.save()
        return HttpResponse(status=200)
    
    @retry_on_exception(3)
    @atomic
    def put(self, request, *args, **kwargs):
        if id is None:
            raise Error("unimplemented")
        form_data = json.loads(request.body.decode())
        name, note_data, summary_data = form_data['title'], form_data["notes_data"], form_data['summary_data']
        curr_note = Notes.objects.filter(title=name)[0]
        if summary_data is not None:
            curr_note.summary_data = encode_google_cloud(curr_note.title, 'summary', summary_data)
        if note_data is not None:
            curr_note.notes_data = encode_google_cloud(name, 'note', note_data)
        curr_note.save()
        return HttpResponse(status=200)