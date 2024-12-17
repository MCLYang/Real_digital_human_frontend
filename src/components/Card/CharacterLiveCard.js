import React from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const CharacterLiveCard = ({ src, liveName, modelId, liveId,modelName }) => {
  const navigate = useNavigate();  

  const handleClick = () => {
    navigate(`/live`, {
      state: { liveId, modelId, modelName, src ,liveName},
    });
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
      <Meta title={liveName} />
    </Card>
  );
};

export default CharacterLiveCard;
