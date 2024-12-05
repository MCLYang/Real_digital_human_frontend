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
  const [token, setToken] = useState(process.env.REACT_APP_AGORA_TOKEN ||'007eJxTYGCY1Z7/9eSKU4FfX0zOc14lubdy6SfmVO39a+NWs0dvn7lZgcHCLCnJ0NLIMDk51czEwtAyMc082TjZ0DgxJTEpycg0SdIrML0hkJGhe70LMyMDBIL4LAwlqcUlDAwAz1QgvA==');
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
      audioTrack.setEnabled(true);
      // Step3: publish audio
      client.publish(audioTrack);
      setIsLive(true);
      setIsVideoOn(true);
    }
  };
  //chatgpt改写的代码
  // const onUserPublish = async (user, mediaType) => {
  //   if (mediaType === "video") {
  //     try {
  //       // Subscribe to the user's video track
  //       const remoteTrack = await client.subscribe(user, mediaType);
  //       // Convert the Agora track to a native MediaStreamTrack
  //       const videoStreamTrack = remoteTrack.getMediaStreamTrack();
  //       // Create a MediaStream and add the native MediaStreamTrack
  //       const remoteStream = new MediaStream();
  //       remoteStream.addTrack(videoStreamTrack);
  //       // Check if the MediaStream was created correctly
  //       console.log(`remoteStream.getTracks()`,remoteStream.getTracks())
  //       if (remoteStream.getTracks().length > 0) {
  //         // Create a Blob URL for the MediaStream
  //         const videoUrl = URL.createObjectURL(remoteStream);
  //         console.log("Generated Blob URL for remote video:", videoUrl);
  
  //         // Set the Blob URL to a video element to play the stream
  //         const videoElement = document.getElementById("remote-video");
  //         videoElement.src = videoUrl;
  //         videoElement.play();
  //       } else {
  //         console.error("Failed to create MediaStream with video tracks.");
  //       }
  //     } catch (error) {
  //       console.error("Error in onUserPublish for video:", error);
  //     }
  //   }
  
  //   if (mediaType === "audio") {
  //     try {
  //       // Subscribe to the user's audio track
  //       const remoteTrack = await client.subscribe(user, mediaType);
        
  //       // Convert the Agora audio track to a native MediaStreamTrack
  //       const audioStreamTrack = remoteTrack.getMediaStreamTrack();
  
  //       // Create a MediaStream and add the native MediaStreamTrack
  //       const remoteStream = new MediaStream();
  //       remoteStream.addTrack(audioStreamTrack);
  
  //       // Check if the MediaStream was created correctly
  //       if (remoteStream.getTracks().length > 0) {
  //         // Create a Blob URL for the audio stream
  //         const audioUrl = URL.createObjectURL(remoteStream);
  //         console.log("Generated Blob URL for remote audio:", audioUrl);
  
  //         // Play the audio in the background
  //         const audioElement = document.createElement('audio');
  //         audioElement.src = audioUrl;
  //         audioElement.play();
  //       } else {
  //         console.error("Failed to create MediaStream with audio tracks.");
  //       }
  //     } catch (error) {
  //       console.error("Error in onUserPublish for audio:", error);
  //     }
  //   }
  // };
  const onUserPublish = async (user, mediaType) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);
      // console.log("ImageData",remoteTrack.getCurrentFrameData());
      remoteTrack.play("remote-video");
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      console.log("remoteTrack",remoteTrack)
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
