import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import ViewTraningPage from './ViewTraningPage/ViewTraningPage';
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('View Training Process', '1', <PieChartOutlined />),
  getItem('Create Avatar Template', '2', <DesktopOutlined />),
  getItem('Create Creator', '3', <DesktopOutlined />),
];

const AdminDashboardpage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={[selectedKey]}  
          selectedKeys={[selectedKey]} 
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Add content based on selected menu item */}
            {selectedKey === '1' && <ViewTraningPage/>}
            {selectedKey === '2' && <div>Avatar Template Content</div>}
            {selectedKey === '3' && <div>Create Creator Content</div>}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardpage;
