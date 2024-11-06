// src/components/AudioStreamer.js
import React, { useState, useEffect } from 'react';

const AudioStreamer = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 创建 WebSocket 连接
    const ws = new WebSocket('ws://your-backend-server-address');  // 替换为你的后台地址
    ws.onopen = () => {
      console.log("WebSocket connected!");
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
    setSocket(ws);

    return () => {
      if (ws) ws.close(); // 清理 WebSocket 连接
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // 使用 Web Audio API 获取麦克风音频
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const mediaStreamSource = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(2048, 1, 1);  // 缓冲区大小

          mediaStreamSource.connect(processor);
          processor.connect(audioContext.destination);

          // 当音频被处理时
          processor.onaudioprocess = (e) => {
            const audioData = e.inputBuffer.getChannelData(0);  // 获取音频数据

            // 将音频数据通过 WebSocket 发送到后端
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(audioData.buffer); // 将音频数据发送到后端
            }
          };
        })
        .catch((err) => {
          console.error('Audio capture failed:', err);
        });
    }
  }, [socket]);

  return <div>音频流式传输中...</div>;
};

export default AudioStreamer;
