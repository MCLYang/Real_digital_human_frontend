import React from 'react';
import { Layout, theme, Col, Row ,Typography} from 'antd';
import CharacterCard from '../components/Card/CharacterCard';

const {Header, Content } = Layout;
const generateCharacterRows = (cardData) => (
  <Row gutter={[15,15]}>
    {cardData.map((card, index) => (
      <Col 
        key={card.avatarId} 
        span={3} 
        style={{ textAlign: 'center' }}
      >
       <CharacterCard src={card.src} modelName={card.modelName} modelId={card.modelId} />
      </Col>
    ))}
  </Row>
);

const HomePage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const cardData = [
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Europe Street beat', modelId: 1 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Paris', modelId: 2 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@New York', modelId: 3 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@London', modelId: 4 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Tokyo', modelId: 5 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Berlin', modelId: 6 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Europe Street beat', modelId: 7 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Paris', modelId: 8 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@New York', modelId: 9 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@London', modelId: 10 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Tokyo', modelId: 11 },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', modelName: '@Berlin', modelId: 12 },
  ];
  return (
    <Layout >
        <Header
          style={{
            background: colorBgContainer,
          }}
        />
        <Content>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
            
            }}
          >
            {/* 标题 */}
            <Row gutter={[0,15]}>        
              <Col
                xs={{ span: 6, offset: 9 }}
                lg={{ span:6, offset: 9 }}
                style={{
                  textAlign: 'center'
                }}
              >   
                <Typography.Title  level={1} style={{ marginButtom: 10}}>
                    Creator List
                </Typography.Title>
              </Col>
            </Row>
            {/* 动态生成多行卡片 */}
            {generateCharacterRows(cardData, 6)} {/* 每行最多6个卡片 */}
          </div>
        </Content>
    </Layout>
  );
};

export default HomePage;
