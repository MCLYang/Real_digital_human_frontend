import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import { Link,Outlet } from 'react-router-dom'; 

const { Content, Sider,Header } = Layout;

const items = [
  { label: 'View Training Process', key: 'viewTraining', icon: <PieChartOutlined /> },
  { label: 'Create Avatar Template', key: 'createAvatar', icon: <DesktopOutlined /> },
  { label: 'Create Creator', key: 'createCreator', icon: <DesktopOutlined /> },
];

const AdminDashboardpage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('viewTraining'); // 默认选中第一个菜单项
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
    
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250}>
      <div className="demo-logo-vertical" style={{backgroundColor:"#002140",height:50}} ></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['viewTraining']}
          selectedKeys={[selectedKey]}  
          onClick={handleMenuClick}
        >
          {items.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              {/* 路由导航 */}
              <Link to={`/admin/dashboard/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout>
      <Header
          style={{
            padding: 0,
            height:50,
            background: colorBgContainer,
          }}
        />
        <Content >
          <div
            style={{
              padding: 24,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* 渲染匹配的子路由 */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardpage;
