import React, { useState, useEffect, useCallback } from 'react';
import './MediaSourceForm.css';
import AgoraRTC from 'agora-rtc-sdk-ng';

const MediaSourceForm = ({ onDeviceIdChange }) => {
  const [videoSource, setVideoSource] = useState('');
  const [microphones, setMicrophones] = useState([]);
  const [selectedAudioSource, setSelectedAudioSource] = useState('');

  // 使用 useEffect 仅在组件挂载时加载一次设备列表
  useEffect(() => {
    const getMicrophones = async () => {
      const devices = await AgoraRTC.getMicrophones();
      console.log(devices);
      setMicrophones(devices);
      // 设置第一个设备为默认选择项（如果存在设备）
      if (devices.length > 0) {
        setSelectedAudioSource(devices[0].deviceId);
        onDeviceIdChange(devices[0].deviceId);  // 初始时传递给父组件
      }
    };
    getMicrophones();
  }, [onDeviceIdChange]); // 依赖 onDeviceIdChange 确保只有在父组件传入回调时加载设备

  // 处理视频源变化
  const handleVideoSourceChange = (e) => {
    setVideoSource(e.target.value);
  };

  // 处理音频设备选择
  const handleAudioSourceChange = useCallback((e) => {
    const deviceId = e.target.value;
    setSelectedAudioSource(deviceId);
    onDeviceIdChange(deviceId);  // 调用父组件的回调函数，传递 deviceId
  }, [onDeviceIdChange]);

  return (
    <div>
      <form>
        {/* 视频源输入框 */}
        <div className="videoURL">
          <label htmlFor="videoSource">视频源地址：</label>
          <input
            type="text"
            id="videoSource"
            value={videoSource}
            onChange={handleVideoSourceChange}
            placeholder="CDN返回的值"
          />
        </div>

        {/* 音频源选择 */}
        <div className="audioSource">
          <label>选择音频源：</label>
          <select
            value={selectedAudioSource}
            onChange={handleAudioSourceChange}
          >
            <option value="">请选择音频输入设备</option>
            {microphones.map((microphone) => (
              <option key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label || '未命名设备'}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default MediaSourceForm;
