import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [isLive, setIsLive] = useState(false);
  const [socket, setSocket] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [mediaStreamSource, setMediaStreamSource] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [audioData, setAudioData] = useState(null);

  // 创建 WebSocket 连接并管理连接
  const initWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8765');
    
    ws.onopen = () => console.log('WebSocket connected!');
    ws.onclose = () => console.log('WebSocket connection closed.');
    
    ws.onmessage = (event) => {
      const receivedAudioData = event.data;
  console.log('Received raw audio data from server:', receivedAudioData);
      const audioURL = URL.createObjectURL(receivedAudioData);
      setAudioData(audioURL);
      console.log('Received audio data from server:', audioURL);
    };

    setSocket(ws);

    return ws;
  };

  // 启动 WebSocket 连接
  useEffect(() => {
    const ws = initWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // 启动音频流
  const startAudioStream = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContextInstance = new (window.AudioContext || window.webkitAudioContext)();
          setAudioContext(audioContextInstance);

          const mediaStreamSourceInstance = audioContextInstance.createMediaStreamSource(stream);
          const processorInstance = audioContextInstance.createScriptProcessor(2048, 1, 1);

          mediaStreamSourceInstance.connect(processorInstance);
          processorInstance.connect(audioContextInstance.destination);

          processorInstance.onaudioprocess = (e) => {
            const audioData = e.inputBuffer.getChannelData(0);
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(audioData.buffer);
            }
          };

          setMediaStreamSource(mediaStreamSourceInstance);
          setProcessor(processorInstance);
        })
        .catch((err) => {
          console.error('Audio capture failed:', err);
        });
    }
  };

  const stopAudioStream = () => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    if (processor) {
      processor.disconnect();
    }
    if (mediaStreamSource) {
      mediaStreamSource.disconnect();
    }
  };

  const startLive = () => {
    setIsLive(true);
    startAudioStream();
  };

  const pauseLive = () => {
    setIsLive(false);
    stopAudioStream();
  };

  const uploadVideo = () => {
    console.log("Uploading video...");
  };

  const handleAudioSelect = (e) => {
    console.log('Audio selected:', e.target.value);
  };

  const downloadStream = () => {
    console.log("Downloading stream...");
  };

  return (
    <div className="container">
      {/* 上半部分，4/5 屏幕 */}
      <div className="top">
        {/* 左侧播放视频 */}
        <div className="video-container">
          <video width="100%" height="100%" autoPlay controls>
            <source src="static/1.mp4" type="video/mp4" />
            您的浏览器不支持播放该视频。
          </video>
        </div>

        {/* 中间显示时间和消息的区域 */}
        <div className="info-container">
          <h3>直播时间: 00:00:00</h3>
          <p>其他信息...</p>
        </div>

        {/* 右侧播放视频 */}
        <div className="video-container">
          <video width="100%" height="100%" autoPlay controls>
            <source src="static/2.mp4" type="video/mp4" />
            您的浏览器不支持播放该视频。
          </video>
        </div>
      </div>

      {/* 下半部分，功能区 */}
      <div className="bottom">
        <div className="button-row">
          <button onClick={uploadVideo}>上传视频</button>
          <button onClick={startLive} disabled={isLive}>开始直播</button>
          <button onClick={pauseLive} disabled={!isLive}>暂停直播</button>
        </div>

        <div className="button-row">
          <select onChange={handleAudioSelect}>
            <option value="default">选择音色</option>
            <option value="voice1">音色1</option>
            <option value="voice2">音色2</option>
          </select>
          <button onClick={downloadStream}>下载直播</button>
        </div>
      </div>

      {/* 显示音频数据 */}
      <div className="audio-data-container">
        <h4>接收到的音频数据:</h4>
        {audioData ? (
          <audio controls preload="auto">
            <source src={audioData} type="audio/wav" />
            您的浏览器不支持音频播放。
          </audio>
        ) : (
          <p>等待音频数据...</p>
        )}
      </div>
    </div>
  );
};

export default App;
