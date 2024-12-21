// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CharacterDetail from './pages/CharacterDetail';  
import LivePage from './pages/LivePage/LivePage';  
import AdminDashboardpage from './pages/AdminPages/AdminDashboardpage'; 
import ViewTraningPage from './pages/AdminPages/ViewTraningPage/ViewTraningPage'; 
import CreateAvatarPage from './pages/AdminPages/CreateAvatarPage/CreateAvatarPage'; 
import CreateCreatorPage from './pages/AdminPages/CreateCreatorPage/CreateCreatorPage'; 
import CreateAvatarInfoPage from './pages/AdminPages/CreateAvatarInfoPage/CreateAvatarInfoPage'; 
import CreateCreatorInfoPage from './pages/AdminPages/CreateCreatorInfoPage/CreateCreatorInfoPage'; 
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 默认加载登录页面 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/character/:modelId/:modelName" element={<CharacterDetail />} />
        <Route path="/live" element={<LivePage />} />

        {/* 配置父路由 "/admin/dashboard" */}
        <Route path="/admin/dashboard" element={<AdminDashboardpage />}>
          {/* 默认渲染第一个子路由 */}
          <Route index element={<ViewTraningPage />} />
          {/* 子路由，根据选中的菜单渲染不同的页面 */}
          <Route path="viewTraining" element={<ViewTraningPage />} />
          <Route path="createAvatar" element={<CreateAvatarPage />} />
          <Route path="createCreator" element={<CreateCreatorPage />} />
          <Route path="createCreatorInfo" element={<CreateCreatorInfoPage />} />
          <Route path="createAvatarInfo" element={<CreateAvatarInfoPage/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
