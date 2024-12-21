import React from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import { Typography, Flex, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; 
import  { ArrowLeftOutlined} from '@ant-design/icons';
const CreateCreatorInfoPage = () => {
  const location = useLocation();
const navigate = useNavigate();  
  const { creatorName } = location.state || {};  

  // 上传配置
  const uploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', 
    headers: {
      authorization: 'authorization-text',  
    },
    data: {
        creatorName,
      },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    beforeUpload(file) {
      const isVideo = file.type.startsWith('video/');  // 确保是视频文件
      if (!isVideo) {
        message.error('只能上传视频文件!');
      }
      return isVideo;
    },
  };
    // 返回上一页
    const handleBack = () => {
        navigate(-1);
        };

  return (
    <div>
        <ArrowLeftOutlined 
        onClick={handleBack} 
          style={{
          marginLeft: 16,
          fontSize: 35,
          cursor: 'pointer',  // 鼠标悬停时显示为手型
        }} />
      <div
        style={{
            display: 'flex',
            justifyContent: 'center', 
            paddingTop: '15%',      
        }}
        >   
        <Flex vertical align="center" justify="center">
          <Typography.Title level={4}>Upload Training Video</Typography.Title>
          <Typography.Title level={4}>For {creatorName}</Typography.Title>

          {/* 上传组件 */}
          <Upload {...uploadProps} >
            <Button type="primary" icon={<UploadOutlined />}style={{width:"200px"}}>Upload</Button>
          </Upload>
        </Flex>
      </div>
    </div>
  );
};

export default CreateCreatorInfoPage;
