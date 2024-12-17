import React from 'react';
import { Layout, theme, Col, Row ,Typography} from 'antd';
import CharacterLiveCard from '../components/Card/CharacterLiveCard';
import { useParams,useNavigate } from 'react-router-dom';
import  { ArrowLeftOutlined} from '@ant-design/icons';
const {Header, Content } = Layout;


const generateCharacterRows = (cardData, cardsPerRow) => {
  const totalCards = cardData.length;
  const rows = [];

  for (let i = 0; i < totalCards; i += cardsPerRow) {
    const currentRowData = cardData.slice(i, i + cardsPerRow);
    rows.push(
      <Row key={i} gutter={[16, 16]}>
        {currentRowData.map((card, index) => (
          <Col
            key={index}
            xs={{ span: 5, offset: index === 0 ? 0 : 1 }}  // 第一个Col没有offset
            lg={{ span: 3, offset: index === 0 ? 0 : 1 }}  // 第一个Col没有offset
          >
            <CharacterLiveCard
              src={card.src}
              modelName={card.modelName}
              modelId={card.modelId}
              liveId={card.liveId}
              liveName={card.liveName}
            />
          </Col>
        ))}
      </Row>
    );
  }

  return rows;
};


const CharacterDetail = () => {
  const { modelName,modelId } = useParams();  
  const navigate = useNavigate();  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const cardData = [
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'normal Live', modelId: 1,liveId: 1, modelName:modelName},
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'skurt Live', modelId: 1,liveId: 2  ,modelName:modelName},
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'Live', modelId: 1 ,liveId: 3,modelName:modelName },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'normal Live', modelId: 1 ,liveId: 4 ,modelName:modelName},
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'skurt Live', modelId: 1 ,liveId: 5,modelName:modelName },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'Live', modelId: 1 ,liveId: 6 ,modelName:modelName},
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'normal Live', modelId: 1 ,liveId: 7 ,modelName:modelName},
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'skurt Live', modelId: 1 ,liveId: 8,modelName:modelName },
    { src: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', liveName: 'Live', modelId: 1 ,liveId: 9,modelName:modelName },
  ];
    // 返回上一页
    const handleBack = () => {
      navigate(-1);
    };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
      <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
        <ArrowLeftOutlined 
        onClick={handleBack} 
          style={{
          marginLeft: 16,
          marginTop:15,
          fontSize: 35,
          background: colorBgContainer,
          cursor: 'pointer',  // 鼠标悬停时显示为手型
        }} />
      </Header>
        <Content
          style={{
            margin: '24px 16px 0 16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight:700,
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
                   {modelName}
                </Typography.Title>
              </Col>
            </Row>
            {/* 动态生成多行卡片 */}
            {generateCharacterRows(cardData, 6)} 
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CharacterDetail;
 