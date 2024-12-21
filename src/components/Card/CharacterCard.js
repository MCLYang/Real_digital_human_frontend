import React from 'react';
import { Card, Flex ,Typography} from 'antd';
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
const CharacterCard = ({ src, modelName, modelId }) => {
  const navigate = useNavigate();  
  const handleClick = () => {
    navigate(`/character/${modelId}/${modelName}`);
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
            {modelName}
          </Typography.Title>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CharacterCard;

