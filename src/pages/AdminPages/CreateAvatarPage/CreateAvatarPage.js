import React from 'react';
import { Typography, Row, Col } from 'antd';
import AvatarCard from '../../../components/Card/AvatarCard'; // 引入 AvatarCard 组件

const CreateAvatarPage = () => {
  // 模拟数据：创建包含 20 个 Creator 的数据数组
  const avatarData = Array.from({ length: 16 }, (_, index) => ({
    url: `https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`,  // 每个头像的 URL
    avatarId: index + 1,  // 每个头像的唯一 ID
    avatarName: `Creator ${index + 1}`,  // 每个头像的名称
  }));

  // 渲染 AvatarCard 组件的函数
const renderAvatarCards = (avatarData) => (
  <Row gutter={[15,15]}>
    {avatarData.map((data, index) => (
      <Col 
        key={data.avatarId} 
        span={4} 
        style={{ textAlign: 'center' }}
      >
        <AvatarCard 
          url={data.url} 
          avatarId={data.avatarId} 
          avatarName={data.avatarName} 
        />
      </Col>
    ))}
  </Row>
);

  return (
    <div>
      <Typography.Title
        level={1}
        style={{
          marginBottom: 30,
        }}
      >
        Choose a creator
      </Typography.Title>
      
      {/* 调用 renderAvatarCards 函数渲染 AvatarCard 组件 */}
      {renderAvatarCards(avatarData)}
    </div>
  );
};

export default CreateAvatarPage;
