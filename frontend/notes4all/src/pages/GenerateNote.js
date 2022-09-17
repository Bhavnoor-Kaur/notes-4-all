import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { Button, TextField } from '@mui/material';


const GenerateNote = (props) => {
    const [token, setToken] = useState(null);
    const [currText, setCurrText] = useState(null);
    const [fullBlob, setFullBlob] = useState(null);
    let websocket = null;
    let recorder = null;
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000")
        .then((response) => response.json())
        .then((data) => setToken(data))
        .catch((e) => console.log(e));
    }, [])

    const run = () => {
        console.log("run");
        if (isRecording) {
            if (websocket) {
                websocket.send(JSON.stringify({ terminate_session: true }));
                console.log("termination");
                //websocket.close();
                //websocket = null;
            }

            if (recorder) {
                recorder.pauseRecording();
                recorder = null;
            }
        }
        else {
            // establish 1600 sample rate wss with AssemblyAI (AAI)
            websocket = new W3CWebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
            console.log(websocket);
            console.log(token);
            
            const texts = {};
            websocket.onmessage = (message) => {
                let msg = '';
                const res = JSON.parse(message.data);
                texts[res.audio_start] = res.text;
                const keys = Object.keys(texts);
                keys.sort((a, b) => a - b);
                for (const key of keys) {
                    if (texts[key]) {
                        msg += ` ${texts[key]}`;
                    }
                }
                console.log("message is:" + msg);
                setCurrText(msg);
            };

            websocket.onerror = (event) => {
                console.error(event);
                websocket.close();
            }
              
            websocket.onclose = (event) => {
                websocket = null;
            }  
            
            websocket.onopen = () => {
                // once socket is open, begin recording
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        recorder = new RecordRTC(stream, {
                            type: 'audio',
                            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                            recorderType: StereoAudioRecorder,
                            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                            desiredSampRate: 16000,
                            numberOfAudioChannels: 1, // real-time requires only one channel
                            bufferSize: 4096,
                            audioBitsPerSecond: 128000,
                            ondataavailable: (blob) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const base64data = reader.result;
                    
                                    // audio data must be sent as a base64 encoded string
                                    if (websocket) {
                                        console.log("send");
                                        websocket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                    }
                                };
                                reader.readAsDataURL(blob);
                                // setFullBlob((prev) => {
                                    
                                // });
                            },
                        });
                        recorder.startRecording();
                    })
                    .catch((err) => console.error(err));
            };
            
        }    

        setIsRecording((prev) => !prev);
    };

    return (
        <>
        <div>
            Here is some data: {currText}
        </div>
        <Button variant="standard" onClick={run}>
            {!isRecording ? "Record" : "Stop"}
        </Button>
        </>
    );
};


export default GenerateNote;