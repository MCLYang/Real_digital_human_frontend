import React, { useState, useEffect } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [mediaStreamSource, setMediaStreamSource] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [audioData, setAudioData] = useState(null);

  // 创建 WebSocket 连接
  const initWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => console.log('WebSocket connected!');
    ws.onclose = () => console.log('WebSocket connection closed.');

    function handleAudioData(event) {
      const receivedAudioData = event.data;
      console.log("Raw audio data received:", receivedAudioData);
    
      // 如果收到的数据是 Blob 类型，转换为 ArrayBuffer
      if (receivedAudioData instanceof Blob) {
        receivedAudioData.arrayBuffer()
          .then((buffer) => {
            // 如果需要调试，查看 ArrayBuffer 数据
            console.log("ArrayBuffer data:", buffer);
    
            // 将 ArrayBuffer 转换为 Float32Array
            const pcmData = new Float32Array(buffer);
    
            // 打印前10个值
            console.log("PCM data (first 10 values):", pcmData.slice(0, 10));
    
            // 使用 Web Audio API 播放音频
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const bufferAudio = audioContext.createBuffer(1, pcmData.length, 44100);  // 假设采样率为 44100
            bufferAudio.getChannelData(0).set(pcmData);
    
            const source = audioContext.createBufferSource();
            source.buffer = bufferAudio;
            source.connect(audioContext.destination);
            source.start();
          })
          .catch((error) => {
            console.error("Error processing audio Blob:", error);
          });
      } else {
        console.error("Received audio data is not a Blob:", receivedAudioData);
      }
    }
    
    ws.onmessage = handleAudioData;


    setSocket(ws);
  };

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
              socket.send(audioData.buffer);  // 发送音频数据到服务器
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

  // 停止音频流
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

  // 启动 WebSocket 连接
  useEffect(() => {
    initWebSocket();
    return () => {
      if (socket) socket.close();
    };
  }, []);

  // 启动/暂停直播
  const startLive = () => {
    startAudioStream();
  };

  const pauseLive = () => {
    stopAudioStream();
  };

  return (
    <div>
      <button onClick={startLive}>Start Live</button>
      <button onClick={pauseLive}>Stop Live</button>

      {/* 显示接收到的音频数据 */}
      <div>
        <h4>接收到的音频数据:</h4>
        {audioData ? (
          <audio controls>
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
