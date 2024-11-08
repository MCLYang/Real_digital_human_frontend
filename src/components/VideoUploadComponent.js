import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';

function VideoUploadComponent() {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      alert("请选择一个视频文件！");
      return;
    }
  
    const formData = new FormData();
    formData.append('video', videoFile);
  
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      // 打印响应体内容，查看返回的原始文本
      const responseText = await response.text();   
      // 解析响应体为 JSON
      let data;
      try {
        data = JSON.parse(responseText); // 尝试解析响应
      } catch (err) {
        return;
      }
  
      if (response.ok) {
        alert("真人视频素材上传成功！");
      } else {
        alert("上传失败：" + (data.error || data.message)); // 显示返回的错误信息
      }
    } catch (error) {
      console.error("上传出错:", error);
      alert("上传出错！");
    }
  };


  return (
    
    <div className="video-upload">
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <Button colorScheme="teal"  onClick={uploadVideo} size="lg">
       上传视频
      </Button>
    </div>
    
  );
}

export default VideoUploadComponent;
