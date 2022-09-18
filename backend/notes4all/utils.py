from distutils.command.upload import upload
import requests
import json
import os
import time
import base64
import codecs

BASE_URL = "https://api.assemblyai.com/v2/transcript"
UPLOAD_URL = "https://api.assemblyai.com/v2/upload"
# ASSEMBLY_KEY = os.getenv("ASSEMBLY_KEY")
ASSEMBLY_KEY = "3bceedca94704197aa93408a30c5ff5c"


def find_summary(audio):
    polling_id = queue_summary(audio)
    done, data = check_summary(polling_id)
    while not done:
        done, data = check_summary(polling_id)
        time.sleep(60)
    return data


TEST_FILE = "test.wav"


def write_to_file(audio):
    audio = str.encode(audio)
    # audio = base64.b64decode(audio)
    with open(TEST_FILE, "wb") as f:
        f.write(audio)


# from https://www.assemblyai.com/docs/walkthroughs#uploading-local-files-for-transcription
def read_file(chunk_size=5242880):
    with open(TEST_FILE, "rb") as _file:
        while True:
            data = _file.read(chunk_size)
            if not data:
                break
            yield data


def upload_audio(audio):
    write_to_file(audio)
    headers = {
        "Authorization": ASSEMBLY_KEY,
        "content-type": "application/json",
    }
    res = requests.post(UPLOAD_URL, headers=headers, data=read_file())
    print(res)
    upload_url = res.json()["upload_url"]
    return upload_url


def queue_summary(audio):
    payload = json.dumps({"audio_url": upload_audio(audio), "auto_chapters": True})
    headers = {
        "Authorization": ASSEMBLY_KEY,
        "content-type": "application/json",
    }
    res = requests.request("POST", BASE_URL, headers=headers, data=payload).json()
    print(f"polling id {res['id']}")
    return res["id"]


def check_summary(polling_id):
    url = BASE_URL + "/" + polling_id
    headers = {
        "Authorization": ASSEMBLY_KEY,
        "content-type": "application/json",
    }
    res = requests.request("GET", url, headers=headers).json()
    status, data = res["status"] == "completed", None
    if status is True:
        data = res["chapters"][0]["summary"]
    return status, data
