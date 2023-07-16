import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";

import { ReactMic } from 'react-mic';

import axios from "axios";

const nodeAppUrl = "http://localhost:3000/postAudio";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [transcript, setTranscript] = useState("");

  const handleStart = () => {
    setRecording(true);
    setBlob(null);
    setTranscript("");
  };

  const handleStop = (recordedBlob) => {
    setRecording(false);
    setBlob(recordedBlob);
  };

  const handleSubmit = async () => {
    if (blob) {                         // checks the blob is not null
      const formData = new FormData();
      formData.append("audio", blob.blob);

      try {
        const { data } = await axios.post(nodeAppUrl, formData);

        if (data.transcript) {
          setTranscript(data.transcript);
        } else {
          setTranscript("No transcript found.");
        }
      } catch (err) {
        console.error(err);
        setTranscript("An error occurred.");
      }
    }
  };

  return (
    <div>
      <ReactMic
        record={recording}
        className="sound-wave"
        onStop={handleStop}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        mimeType="audio/webm"
      />
      <Button variant="primary" onClick={handleStart} disabled={recording}>
        Start
      </Button>
      <Button variant="secondary" onClick={handleStop} disabled={!recording}>
        Stop
      </Button>
      <Button variant="success" onClick={handleSubmit} disabled={!blob}>
        Submit
      </Button>
      <Alert variant="info">{transcript || "No transcript yet."}</Alert>
    </div>
  );
};

const App = () => {
  return (
    <Container className="mt-4">
      <h1>Speech to Text App</h1>
      <Recorder />
    </Container>
  );
};

export default App;
