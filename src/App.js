import React, { useState ,useRef,useEffect} from 'react';
import VideoUploadComponent from './components/VideoUploadComponent';
// import AudioRecorder from './components/AudioRecorder';
import './App.css';
import { Button } from '@chakra-ui/react';
import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});
let audioTrack;
let videoTrack;

const App = () => {
  const [IsJoined, setIsJoined] = useState(false);  
  const [statusMessage, setStatusMessage] = useState('');  
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [token, setToken] = useState('007eJxTYOD+vWOJw5b5t2dKNGy7vfLxkS5OOas/mVtfnr1rumoud1i2AoOFWVKSoaWRYXJyqpmJhaFlYpp5snGyoXFiSmJSkpFp0s5Kz/SGQEYGxtspTEASDEF8FoaS1OISBgYAEvAh1w==');
  const [appid, setAppid] = useState(process.env.REACT_APP_AGORA_APPID || '');
  const [channel, setChannel] = useState(process.env.REACT_APP_AGORA_CHANNEL || '');
  const [isLive, setIsLive] = useState(false);

  //选择音色
  const handleAudioSelect = (e) => {
    console.log('Audio selected:', e.target.value);
  };
  //下载视频
  const downloadStream = () => {
    console.log("Downloading stream...");
  };
  const turnOnCamera = async (flag) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);
    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    videoTrack = await AgoraRTC.createCameraVideoTrack();
    videoTrack.play("camera-video");
  };
 const handleLiveAction1=async () => {
      if (isLive) {
        client.leave();
        setIsLive(false);
        audioTrack.setEnabled(false);
    }else{
        //step1: joinChannel
        client.on("user-published", onUserPublish);
        try {  
          // 加入频道
          await client.join(appid, channel, token || null, null);
        } catch (error) {
          alert("Error joining the channel or handling user-published event:", error);
          return
        }
        setIsJoined(true);
        //step2: turnOnMicrophone
        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        audioTrack.setEnabled(true);
        //step3: publish audio
        client.publish(audioTrack);
        setIsLive(true);
    }
}
  const onUserPublish = async (
    user,
    mediaType
  ) => {
    if (mediaType === "video") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play("remote-video");
      // setIsVideoSubed(true);
    }
    if (mediaType === "audio") {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  //填写临时token
  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };
  return (
    <div className="container">
      <div className="top">
        <div className="video-container">
          {/* <video width="100%" height="100%" autoPlay controls>
            <source src="static/1.mp4" type="video/mp4" />
            您的浏览器不支持播放该视频。
          </video> */}
          <video id="remote-video" hidden={isVideoOn ? false : true}></video>
        </div>
        <div className="info-container">
          <h3>直播时间: {}</h3>
        <label htmlFor="token">临时Token:</label>
        <input
          id="token"
          type="password"
          value={token}
          onChange={handleTokenChange}
          placeholder="请输入Token"
        />
          <p>{statusMessage}</p>
        </div>
      <div className="video-container">
      <video id="camera-video" hidden={isVideoOn ? false : true}></video>
      </div>
      </div>
      <div className="bottom">
        <div className="button-row">
        <VideoUploadComponent />
        {/* <Button colorScheme="teal"    onClick={() => turnOnCamera()}
            className={isVideoOn ? "button-on" : ""}  size="lg">
          测试Turn {isAudioOn ? "off" : "on"} camera
        </Button> */}
        <Button
        colorScheme="teal"
        onClick={handleLiveAction1}
        size="lg"
      >
        {isLive ? '结束直播' : '开始直播'} 
       </Button>
        </div>
        <div className="button-row">
          <select onChange={handleAudioSelect}>
            <option value="default">选择音色</option>
            <option value="voice1">音色1</option>
            <option value="voice2">音色2</option>
          </select>
          <Button colorScheme="teal"  onClick={downloadStream} size="lg">
          下载直播
        </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
