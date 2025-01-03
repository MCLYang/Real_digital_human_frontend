import React, { useState, useEffect } from "react";
import { Layout, Menu, theme } from "antd";
import { PieChartOutlined, DesktopOutlined } from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Content, Sider, Header } = Layout;

const items = [
  {
    label: "View Training Process",
    key: "viewTraining",
    icon: <PieChartOutlined />,
  },
  {
    label: "Create Avatar Template",
    key: "createAvatar",
    icon: <DesktopOutlined />,
  },
  { label: "Create Creator", key: "createCreator", icon: <DesktopOutlined /> },
];

const AdminDashboardpage = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // 获取当前路径并验证是否为有效的菜单项
  const getValidKey = (path) => {
    return items.some((item) => item.key === path) ? path : "viewTraining";
  };

  // 初始化时，如果是根路径 /admin/dashboard，则默认选中 viewTraining
  const initialPath = location.pathname.split("/").pop();
  const [selectedKey, setSelectedKey] = useState(
    location.pathname === "/admin/dashboard"
      ? "viewTraining"
      : getValidKey(initialPath)
  );

  // 当路径变化时更新selectedKey
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setSelectedKey(getValidKey(path));
  }, [location.pathname]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
      >
        <div
          className="demo-logo-vertical"
          style={{ backgroundColor: "#002140", height: 50 }}
        ></div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={`/admin/dashboard/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            height: 50,
            background: colorBgContainer,
          }}
        />
        <Content>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardpage;
