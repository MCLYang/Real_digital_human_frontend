import React from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const CharacterCard = ({ src, modelName, modelId }) => {
  const navigate = useNavigate();  
  const handleClick = () => {
    // 跳转到角色详情页面，传递 modelId 参数
    navigate(`/character/${modelId}/${modelName}`);
  };
  return (
    <Card
      hoverable
      style={{
        width: 240,
      }}
      cover={<img alt="example" src={src} />}
      onClick={handleClick}  
    >
      <Meta title={modelName} />
    </Card>
  );
};

export default CharacterCard;
