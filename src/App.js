import React, { useState, useCallback } from 'react';
import MediaSourceForm from './components/MediaSourceForm/MediaSourceForm';
import './App.css';
import { Button } from '@chakra-ui/react';
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

let audioTrack;

const App = () => {
  const [isJoined, setIsJoined] = useState(false);  
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [token, setToken] = useState('007eJxTYNA+KGevEyLx8PROxl3z3rnP/BIpvuZEgYuckFpkXNqc8j0KDBZmSUmGlkaGycmpZiYWhpaJaebJxsmGxokpiUlJRqZJFpf80xsCGRn6XtaxMDJAIIjPwlCSWlzCwAAA8Foe5Q==');
  const [appid, setAppid] = useState(process.env.REACT_APP_AGORA_APPID || '');
  const [channel, setChannel] = useState(process.env.REACT_APP_AGORA_CHANNEL || '');
  const [isLive, setIsLive] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // 使用 useCallback 优化 handleDeviceIdChange 回调函数
  const handleDeviceIdChange = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
    console.log('deviceIdChange triggered at:', new Date(), deviceId);
  }, []);

  const handleLiveAction = async () => {
    if (isLive) {
      client.leave();
      setIsLive(false);
      setIsVideoOn(false);
      audioTrack.setEnabled(false);
    } else {
      // Step1: joinChannel
      client.on("user-published", onUserPublish);
      try {
        await client.join(appid, channel, token || null, null);
      } catch (error) {
        alert("Error joining the channel or handling user-published event:", error);
        return;
      }
      setIsJoined(true);
      // Step2: turnOnMicrophone
      // audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
           microphoneId: selectedDeviceId || 'default' 
      });
      console.log("**************************",audioTrack)
      audioTrack.setEnabled(true);

      // Step3: publish audio
      client.publish(audioTrack);
      setIsLive(true);
      setIsVideoOn(true);
    }
  };

  const onUserPublish = async (user, mediaType) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play("remote-video");
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  return (
    <div className="container">
      <div className="top">
        <div className="video-container">
          <video id="remote-video" hidden={!isVideoOn}></video>
        </div>
      </div>
      <div className="info-container">
        <MediaSourceForm onDeviceIdChange={handleDeviceIdChange} />
      </div>
      <div className="bottom">
        <div className="button-row">
        <Button
        colorScheme={isLive ? "red" : "teal"}
        onClick={handleLiveAction}
        size="lg"
      >
        {isLive ? "关闭音频传输" : "开启音频传输"}
      </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
