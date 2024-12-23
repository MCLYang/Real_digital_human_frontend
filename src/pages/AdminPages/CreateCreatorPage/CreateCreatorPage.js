import React, { useState } from 'react';
import { Card, Flex, Typography, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';  
const cardStyle = {
  width: "20%",
  border: "none",
};

const CreateCreatorPage = () => {
  const [creatorName, setCreatorName] = useState('');
  const navigate = useNavigate(); 
  const handleCreate = () => {
    navigate('/admin/dashboard/createCreatorInfo', { state: { creatorName } });
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {  
      handleCreate();
    }
  };

  return (
    <div>
      <Typography.Title
        level={1}
      >
      Create Creator
      </Typography.Title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: "12%",
        }}
      >
        <Card
          hoverable
          style={cardStyle}
          bodyStyle={{
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <Flex vertical align="center">
            <Typography.Title
              level={5}
              style={{
                marginTop: "20px",
                marginBottom: '20px'
              }}
            >
              Creator Name
            </Typography.Title>
            <Input
              placeholder="Input Name"
              value={creatorName}  
              onChange={(e) => setCreatorName(e.target.value)}  
              onKeyDown={handleKeyDown}  
              style={{ marginBottom: '20px', width: "70%" }}
            />
            <Button 
              type="primary" 
              style={{ marginBottom: '20px', width: "70%" }} 
              onClick={handleCreate} 
            >
              Create
            </Button>
          </Flex>
        </Card>
      </div>
    </div>
  );
};

export default CreateCreatorPage;
