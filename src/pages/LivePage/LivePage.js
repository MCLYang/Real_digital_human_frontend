import React, { useState, useCallback } from 'react';
import { useLocation,useNavigate  } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import AgoraRTC from "agora-rtc-sdk-ng";
import {  Splitter, Typography ,Row, Col,Layout,  theme } from 'antd'
import MediaSourceForm from '../../components/MediaSourceForm/MediaSourceForm';
import ChannelActionButton from "../../components/Button/ChannelActionButton";
import './LivePage.css';
import  { ArrowLeftOutlined} from '@ant-design/icons';
const { Header, Content } = Layout;
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});
let audioTrack;
const LivePage = () => {
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken(); 
  const location = useLocation();
  const { liveId, modelId, modelName ,liveName} = location.state || {};
  const [isJoined, setIsJoined] = useState(false);  
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [appid, setAppid] = useState(process.env.REACT_APP_AGORA_APPID || '');//声网项目的APP_ID
  const [isLive, setIsLive] = useState(false);
  const [isChannelCreated, setIsChannelCreated] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [channelData, setChannelData] = useState({channel_id: "", token: "", uid: "",});
  const navigate = useNavigate();  

  // 通过回调函数接收更新的数据
  const handleChannelDataChange = (newChannelData) => {
    setChannelData(newChannelData);
    setIsChannelCreated(!!newChannelData.channel_id);
  };
  const handleDeviceIdChange = useCallback((deviceId) => {
    setSelectedDeviceId(deviceId);
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
      //监听远程音视频轨道
      client.on("user-published", onUserPublish);
      try {
      //加入对应频道
        await client.join(appid, channelData.channel_id, channelData.token, Number(channelData.uid));
      } catch (error) {
        alert("Error joining the channel or handling user-published event:", error);
        return;
      }
      setIsJoined(true);
      // 打开麦克风
      audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
           microphoneId: selectedDeviceId || 'default' 
      });
      audioTrack.setEnabled(true);
      // 将音频推到声网
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
  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };
  return (
  <Layout>
      <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
        <ArrowLeftOutlined 
        onClick={handleBack} 
          style={{
          marginLeft: 16,
          marginTop:15,
          fontSize: 35,
          background: colorBgContainer,
          cursor: 'pointer',  // 鼠标悬停时显示为手型
        }} />
        </Header>
      <Content
        style={{
          margin: '24px 16px 0',
        }}
      >
      <Splitter
        style={{
          minHeight: 700,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: colorBgContainer,
          borderRadius: borderRadiusLG,
          
        }}
      >
        <Splitter.Panel defaultSize="50%" min="50%" max="50%">
        <MediaSourceForm onDeviceIdChange={handleDeviceIdChange} />
        <div className='BottomButton'>
          <Row gutter={16} align="middle">
            <Col span={11} offset={1}>
              <ChannelActionButton onChannelDataChange={handleChannelDataChange} />
            </Col>
            <Col span={12}>
            <Button
            colorScheme={isLive ? "red" : "teal"}
            onClick={handleLiveAction}
            size="lg"
            >
            {isLive ? "关闭音频传输" : "开启音频传输"}
            </Button>
            </Col>
          </Row>
        </div>
        </Splitter.Panel>
        <Splitter.Panel>
         <div className="top">
           <div className="videoContainer">
              <video id="remote-video" hidden={!isVideoOn}></video>
           </div>
           <div className='lableName'>{modelName}|{liveName}</div>
         </div>
        </Splitter.Panel>
      </Splitter>
      </Content>
    </Layout>
  );
};

export default LivePage;

