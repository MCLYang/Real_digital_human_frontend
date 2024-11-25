import React, { useState, useRef } from "react";
import DailyIframe from "@daily-co/daily-js";
import { Button } from "@chakra-ui/react";

let callFrame; 

function joinRoom(conversationId) {
  if (callFrame) {
    callFrame.leave(); // 离开当前房间
  }

  // 创建 DailyIframe 实例
  callFrame = DailyIframe.createFrame({
    showLeaveButton: true,
    iframeStyle: {
      position: "fixed",
      width: "40%",
      height: "58%",
      top: "0%",
      right: "0%",
      zIndex: 1,
      transform: "translate(-0%, -0%)",
    },
  });

  // 加入房间
  callFrame
    .join({ url: `https://tavus.daily.co/${conversationId}` })
    .then(() => console.log(`Successfully joined room: ${conversationId}`))
    .catch((err) => console.error("Error joining the room:", err));
  // 接收来自 Daily iframe 的消息
  callFrame.on("app-message", (message) => {
    console.log("Received app-message:", message);
  });
}

const AudioRecorder = ({ onConversationId }) => {
  const [isRecording, setIsRecording] = useState(false); // 是否正在录音
  const [segments, setSegments] = useState([]); // 录音段落数组
  const audioContextRef = useRef(null); // AudioContext 引用
  const analyserRef = useRef(null); // AnalyserNode 引用
  const mediaRecorderRef = useRef(null); // MediaRecorder 引用
  const silenceTimerRef = useRef(null); // 静音检测定时器
  const audioChunksRef = useRef([]); // 存储录音片段
  const [isLive, setIsLive] = useState(false); // 按钮状态
  const [loading, setLoading] = useState(false); // 加载状态

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048; // FFT大小，分辨率越高性能消耗越大
      analyserRef.current = analyser;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      // 当有录音数据可用时，收集音频数据块
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      // 当录音停止时，处理录音片段并存储
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          audioChunksRef.current = []; // 清空已存储的音频片段
          // 将 Blob 转换为 ArrayBuffer
          const arrayBuffer = await audioBlob.arrayBuffer();
          // 使用 AudioContext 解码音频数据
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          // 获取音频时长（秒）
            const duration = audioBuffer.duration;
            console.log(duration);
            if (duration <= 1.5) {
              console.log("Audio is too short to send. Duration:", duration);
              return; // 提前退出
            }
          // 调整采样率到 16kHz 并转换为 16-bit PCM 格式
          const pcmData = downsampleToPCM(audioBuffer, 16000);  
          const uint8Array = new Uint8Array(pcmData.buffer); // 转换为 Uint8Array
          let base64Audio = "";
          const chunkSize = 1024 * 64; // 每块大小为 64KB
        
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize); // 截取当前块
            base64Audio += btoa(String.fromCharCode(...chunk)); // 转换为 Base64 并拼接
          }
          // 转换为 Base64 字符串
          // const base64Audio = btoa(
          //   String.fromCharCode(...new Uint8Array(pcmData.buffer))
          // );
          // // 更新音频片段
          // const audioURL = URL.createObjectURL(audioBlob);
          // setSegments((prev) => [...prev, audioURL]);    
          if (!callFrame) {
            console.error("callFrame is not initialized. Please join a room first.");
            alert("Please join a room before sending messages.");
            return;
          }
          let messageData = {
            message_type: "conversation",
            event_type: "conversation.echo",
            conversation_id: "c123456", // 这里可以动态传递实际的 conversation_id
            properties: {
              text: "hello world jz",
              inference_id: "inference-id-123",
              done: "true",
            },
          };
          messageData.properties.audio = base64Audio; // 将音频添加到消息中
          messageData.properties.modality = "audio";
          // 发送消息
          callFrame.sendAppMessage(messageData);
          console.log("Message sent:", messageData);

        } catch (error) {
          console.error("Error processing audio:", error);
        }
      };
      // 启动录音
      mediaRecorder.start();
      setIsRecording(true);
      // 开始实时检测静音和断句
      detectSilenceAndPauses();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
      // 音频采样率调整函数（16kHz 和 16-bit PCM）
      function downsampleToPCM(audioBuffer, targetSampleRate) {
        const sourceSampleRate = audioBuffer.sampleRate;
        const sampleRateRatio = sourceSampleRate / targetSampleRate;
        const length = Math.ceil(audioBuffer.length / sampleRateRatio);
        const result = new Int16Array(length);
        const input = audioBuffer.getChannelData(0); // 只使用第一个通道
        for (let i = 0; i < length; i++) {
          const index = Math.floor(i * sampleRateRatio);
          const sample = Math.max(-1, Math.min(1, input[index])); // 确保样本值在 [-1, 1] 范围内
          result[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff; // 转换为 16-bit PCM
        }
        return result;
      }
      // 停止录音
      const stopRecording = () => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        clearInterval(silenceTimerRef.current); // 清除静音检测定时器
        setIsRecording(false);
      };

    // 静音检测
    const detectSilenceAndPauses = () => {
      const analyser = analyserRef.current;
      const dataArray = new Uint8Array(analyser.fftSize);
      let silenceStartTime = null; // 静音开始时间
      const silenceDurationThreshold = 1000; // 静音阈值（毫秒）
      const analyzeAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        if (volume > 10) {
          // 检测到音频信号，重置静音时间
          silenceStartTime = null;
          console.log("Speaking detected...");
        } else {
          // 检测到静音
          if (!silenceStartTime) {
            silenceStartTime = Date.now();
          } else if (Date.now() - silenceStartTime > silenceDurationThreshold) {
            console.log("Pause detected...");
            // 停止当前录音并自动开始下一段录音
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.start(); // 重新开始录音
            silenceStartTime = null;
          }
        }
      };
    // 每 50ms 检测一次音量
    silenceTimerRef.current = setInterval(analyzeAudio, 50);
  };
  // 创建并加入房间
  const createRoomAndJoin = async () => {
    const options = {
      method: "POST",
      headers: {
        "x-api-key": "5e89d8549e994258a3966e8f014b045b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replica_id: "r638794ceb2a",
        properties: {
          max_call_duration: 180,
          participant_absent_timeout: 60,
        }
      }),
    };
    setLoading(true); // 开始加载
    try {
      const response = await fetch("https://tavusapi.com/v2/conversations", options);
      const data = await response.json();
      if (data.conversation_id) {
        console.log("Conversation ID:", data.conversation_id);
        joinRoom(data.conversation_id); // 创建并加入房间
        setIsLive(true); // 标记为直播状态
        onConversationId(data.conversation_id); // 将 conversation_id 传递给父组件
      } else {
        console.error("Failed to retrieve conversation_id:", data);
      }
    } catch (err) {
      console.error("Error fetching conversation_id:", err);
    } finally {
      setLoading(false); // 加载结束
    }
  };
  return (
    <div>
      <h1>使用tavus音频直播</h1>
      <Button onClick={createRoomAndJoin} disabled={loading}>
          {loading ? "创建中..." : "创建房间并加入"}
        </Button>
      <Button onClick={isRecording ? stopRecording : startRecording} disabled={loading}>
          {isRecording ? "停止直播" : "开始直播"}
      </Button>
       
    </div>
  );
};

export default AudioRecorder;
