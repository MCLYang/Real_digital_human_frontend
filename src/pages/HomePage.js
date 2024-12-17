import React from 'react';
import { Layout, theme, Col, Row ,Typography} from 'antd';
import CharacterCard from '../components/Card/CharacterCard';

const {Header, Content } = Layout;

// 生成每行的卡片列
const generateCharacterRows = (cardData, cardsPerRow) => {
  const totalCards = cardData.length;
  const rows = [];
  // 通过循环来分割卡片数据为每行指定的列数
  for (let i = 0; i < totalCards; i += cardsPerRow) {
    const currentRowData = cardData.slice(i, i + cardsPerRow);
    rows.push(
      <Row key={i} gutter={[16, 16]}>
        {currentRowData.map((card, index) => (
          <Col
            key={index}
            xs={{ span: 5, offset: index === 0 ? 0 : 1 }}  
            lg={{ span: 3, offset: index === 0 ? 0 : 1 }}
          >
            {/* 传递 modelId 到 CharacterCard */}
            <CharacterCard src={card.src} modelName={card.modelName} modelId={card.modelId} />
          </Col>
        ))}
      </Row>
    );
  }
  return rows;
};


const HomePage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
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
    <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 700,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 标题 */}
            <Row >        
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
