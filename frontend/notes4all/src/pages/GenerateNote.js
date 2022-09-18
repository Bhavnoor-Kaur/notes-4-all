import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { Button } from '@mui/material';
import BlobBuilder from '../helpers/BlobBuilder';


const GenerateNote = (props) => {
    const [recorder, setRecorder] = useState(null);
    const [token, setToken] = useState(null);
    const [currText, setCurrText] = useState("");
    const [fullText, setFullText] = useState("");

    const [fullBlob, setFullBlob] = useState(null);
    let websocket = null;
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8001")
        .then((response) => response.json())
        .then(({token}) => setToken(token))
        .catch((e) => console.log(e));
    }, [])

    const run = () => {
        if (isRecording) {
            if (websocket) {
                websocket.send(JSON.stringify({ terminate_session: true }));
                websocket.close();
                websocket = null;
            }

            if (recorder) {
                recorder.stopRecording();
                setRecorder(null);
            }
        }
        else {
            // establish 1600 sample rate wss with AssemblyAI (AAI)
            const url = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`;
            websocket = new W3CWebSocket(url);
            
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
                if (res.message_type === "FinalTranscript") {
                    setFullText(msg);
                }
                setCurrText(msg);
            };

            websocket.onerror = (event) => {
                console.error(event);
                websocket.close();
            }
              
            websocket.onclose = (event) => {
                console.log(event);
                websocket = null;
                sendToServer();
                setCurrText('');
                setFullText('');
            }  
            
            websocket.onopen = () => {
                // once socket is open, begin recording
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then((stream) => {
                        const _recorder = new RecordRTC(stream, {
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
                                        websocket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                    }
                                };
                                reader.readAsDataURL(blob);

                                var blobBuilder = new BlobBuilder();
                                blobBuilder.append(fullBlob);
                                blobBuilder.append(blob);
                                setFullBlob(blobBuilder.getBlob());
                            }
                        });
                        _recorder.startRecording();

                        setRecorder(_recorder);
                    })
                    .catch((err) => console.error(err));
            };
            
        }    

        setIsRecording((prev) => !prev);
    };

    const sendToServer = () => {
        if (fullText !== null && fullBlob !== null && !isRecording) {
            fetch("http://localhost:8001/notes",
            {
                method: "POST",
                headers: { Accept: "application/json" },
                body: fullText
                
            })
            .then(res => console.log(res))
            .catch(e => console.error(e));            
            
            const fd = new FormData();
            fd.append('audio', fullBlob);
            fetch("http://localhost:8001/notes",
            {
                method: "PUT",
                headers: { Accept: "application/json" },
                body: fd
                
            })
            .then(res => console.log(res))
            .catch(e => console.error(e));
        }
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