import requests
import json
import os
import time

BASE_URL = "https://api.assemblyai.com/v2/transcript/"
ASSEMBLY_KEY = os.getenv('ASSEMBLY_KEY')

def find_summary(audio):
    polling_id = queue_summary(audio)
    done, data = check_summary(polling_id)
    while not done:
        done, data = check_summary(polling_id)
        time.sleep(5)
    return data

def convert_audio_to_url(audio):
    return "https://bit.ly/3rBnQ8i"

def queue_summary(audio):
    payload = json.dumps({
        "audio_url": convert_audio_to_url(audio),
        "auto_chapters": True
    })
    headers = {
        'Authorization': ASSEMBLY_KEY,
        'content-type': 'application/json',
    }
    res = requests.request("POST", BASE_URL, headers=headers, data=payload)
    print(res.status_code)
    print(res.json)
    res = json.loads(res.body.decode())
    return res['id']

def check_summary(polling_id):
    url = BASE_URL + polling_id
    headers = {
        'Authorization': ASSEMBLY_KEY,
        'content-type': 'application/json',
    }
    res = requests.request("GET", url, headers=headers)
    res = json.loads(res.body.decode())
    return res['status']=="completed", res['chapters'][0]["summary"]
    
    