import React, { useEffect, useRef, useState } from 'react';

const AudioStreamComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);  // 新增状态用于存储音频数据URL
  const audioContextRef = useRef(null);
  const socketRef = useRef(null);
  const processorRef = useRef(null);
  const audioRef = useRef(null);  // 用来引用audio元素

  // 开始录音并连接 WebSocket
  const startRecording = () => {
    if (isRecording) return;

    // 获取用户音频流
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // 创建音频上下文
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        // 创建音频处理器
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
        source.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);

        // 初始化 WebSocket 连接
        socketRef.current = new WebSocket('ws://localhost:3001');  // 使用 WebSocket 连接到 Python 后端

        // WebSocket 连接成功后
        socketRef.current.onopen = () => {
          console.log("WebSocket 连接成功");
        };

        // WebSocket 错误处理
        socketRef.current.onerror = (error) => {
          console.error('WebSocket 连接错误:', error);
        };

        // 监听音频处理器
        processorRef.current.onaudioprocess = (event) => {
          const audioData = event.inputBuffer.getChannelData(0);  // 获取音频数据
          const audioBuffer = audioData.buffer;
          if (socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(audioBuffer);  // 发送音频数据到服务器
          }
        };

        // 监听 WebSocket 返回的音频数据
        socketRef.current.onmessage = (event) => {
          const receivedAudioData = event.data; // 假设后端返回的是处理后的音频数据

          // 将接收到的音频数据转换为 Blob 对象并创建播放链接
          const audioBlob = new Blob([receivedAudioData], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);

          // 更新音频数据源，并自动播放音频
          setAudioUrl(audioUrl);
        };

        setIsRecording(true);
      })
      .catch((error) => {
        console.error("获取音频流失败:", error);
      });
  };

  // 停止录音并断开 WebSocket
  const stopRecording = () => {
    if (!isRecording) return;

    processorRef.current.disconnect();
    socketRef.current.close();  // 关闭 WebSocket 连接
    setIsRecording(false);
  };

  // 在组件销毁时清理
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();  // 确保 WebSocket 连接在组件卸载时关闭
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();  // 关闭音频上下文
      }
    };
  }, []);

  // 在audioUrl 更新后自动播放音频
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("自动播放音频时出错:", error);
      });
    }
  }, [audioUrl]);

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        开始录音
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        停止录音
      </button>

      {/* 自动播放接收到的音频 */}
      {audioUrl && (
        <div>
          <h4>接收到的音频：</h4>
          <audio ref={audioRef} controls>
            <source src={audioUrl} type="audio/wav" />
            您的浏览器不支持音频播放。
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioStreamComponent;
