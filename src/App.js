import React, { useState, useCallback } from 'react';
import MediaSourceForm from './components/MediaSourceForm/MediaSourceForm';
import ChannelAction from "./components/ChannelAction/ChannelAction";
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
 // const [token, setToken] = useState(process.env.REACT_APP_AGORA_TOKEN ||'007eJxTYGCY1Z7/9eSKU4FfX0zOc14lubdy6SfmVO39a+NWs0dvn7lZgcHCLCnJ0NLIMDk51czEwtAyMc082TjZ0DgxJTEpycg0SdIrML0hkJGhe70LMyMDBIL4LAwlqcUlDAwAz1QgvA==');
  const [appid, setAppid] = useState(process.env.REACT_APP_AGORA_APPID || '');

 // const [channel, setChannel] = useState(process.env.REACT_APP_AGORA_CHANNEL || '');
  const [isLive, setIsLive] = useState(false);
  const [isChannelCreated, setIsChannelCreated] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [channelData, setChannelData] = useState({
    channel_id: "",
    token: "",
    uid: "",
  });
  // 通过回调函数接收更新的数据
  const handleChannelDataChange = (newChannelData) => {
    console.log('handleChannelDataChange triggered at:', new Date(), newChannelData);
    setChannelData(newChannelData);
    setIsChannelCreated(!!newChannelData.channel_id);
  };
  const handleDeviceIdChange = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
    console.log('deviceIdChange triggered at:', new Date(), deviceId);
  }, []);
  //开启直播按钮处理
  const handleLiveAction = async () => {
    if (isLive) {
      client.leave();
      setIsLive(false);
      setIsVideoOn(false);
      audioTrack.setEnabled(false);
    } else {
      //判断是否创建频道
      if(!isChannelCreated){
        alert("Please create a channel first!");
        return;
      }     
      // Step0: create audio track
      // Step1: joinChannel
      client.on("user-published", onUserPublish);
      try {
        await client.join(appid, channelData.channel_id, channelData.token, channelData.uid);
      } catch (error) {
        alert("Error joining the channel or handling user-published event:", error);
        return;
      }
      setIsJoined(true);
      // Step2: turnOnMicrophone
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
        <ChannelAction onChannelDataChange={handleChannelDataChange} />
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
