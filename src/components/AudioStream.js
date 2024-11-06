import React, { useEffect, useRef, useState } from 'react';

// WebSocket 服务端地址
const WEBSOCKET_URL = 'ws://your-server-url'; // 替换为你后端的 WebSocket 地址

const AudioStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [ws, setWs] = useState(null);
  const audioContextRef = useRef(null);
  const microphoneRef = useRef(null);
  const processorRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // 发送音频数据到 WebSocket
  const sendAudioData = (audioData) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(audioData);
    }
  };

  // 初始化音频流
  const startAudioStream = async () => {
    try {
      // 获取用户麦克风音频流
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // 创建 Web Audio API 的 ScriptProcessorNode 进行音频处理
      processorRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);
      
      // 处理音频数据并发送
      processorRef.current.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const audioData = inputBuffer.getChannelData(0); // 获取左声道的音频数据
        sendAudioData(audioData); // 发送音频数据到 WebSocket 后端
      };

      // 连接音频流到处理节点
      sourceNodeRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination); // 连接到扬声器播放

      // 初始化 WebSocket 客户端
      const websocket = new WebSocket(WEBSOCKET_URL);
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        const processedAudio = event.data;
        playProcessedAudio(processedAudio); // 播放后端返回的音频
      };

      websocket.onclose = () => {
        console.log('WebSocket connection closed');
        setWs(null);
      };

      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing the microphone:', error);
    }
  };

  // 播放从后端接收到的音频流
  const playProcessedAudio = (audioData) => {
    if (!audioContextRef.current) return;
    const buffer = audioContextRef.current.createBuffer(1, audioData.length, 44100);
    buffer.getChannelData(0).set(new Float32Array(audioData));
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  // 停止音频流
  const stopAudioStream = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      setIsStreaming(false);
    }
    if (ws) {
      ws.close();
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return (
    <div>
      <h1>实时音频流式传输</h1>
      <button onClick={startAudioStream} disabled={isStreaming}>
        开始直播
      </button>
      <button onClick={stopAudioStream} disabled={!isStreaming}>
        停止直播
      </button>
    </div>
  );
};

export default AudioStream;
