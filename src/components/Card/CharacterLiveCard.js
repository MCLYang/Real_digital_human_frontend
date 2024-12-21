import React from 'react';
import { Card, Flex,Typography } from 'antd';
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
      style={cardStyle}
      bodyStyle={{
        padding: 0,
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      <Flex vertical>
        <img
          alt="avatar"
          src={src}
          style={imgStyle}
        />
        <Flex vertical align="center">
          <Typography.Title level={3}>
            {liveName}
          </Typography.Title>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CharacterLiveCard;

