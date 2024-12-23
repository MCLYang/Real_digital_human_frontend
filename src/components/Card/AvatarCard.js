import React from 'react';
import { Card, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';  
const cardStyle = {
    width: "100%"
  };
  const imgStyle = {
    display: 'block',
    width: "100%",
    height: 180,
    borderRadius: '4px',
  };

const AvatarCard = ({ url, avatarId, avatarName }) => {
  const navigate = useNavigate();  // 使用 useNavigate 来实现页面跳转

  // 处理点击事件
  const handleClick = () => {
    navigate('/admin/dashboard/createAvatarInfo', { state: { avatarId, avatarName } });
  };

  return (
        <Card
          hoverable
          style={cardStyle}
          bodyStyle={{
            padding: 0,
            overflow: 'hidden',
          }}
          onClick={handleClick}  // 绑定点击事件
        >
          <Flex vertical>
            <img
              alt="avatar"
              src={url}
              style={imgStyle}
            />
            <Flex vertical align="center">
              <Typography.Title level={3}>
                {avatarName}
              </Typography.Title>
            </Flex>
          </Flex>
        </Card>
  );
};

export default AvatarCard;
