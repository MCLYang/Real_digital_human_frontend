// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CharacterDetail from './pages/CharacterDetail';  
import LivePage from './pages/LivePage/LivePage';  
import AdminDashboardpage from './pages/AdminPages/AdminDashboardpage'; 
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 默认加载登录页面 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/character/:modelId/:modelName" element={<CharacterDetail />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardpage/>} />
      </Routes>
    </Router>
  );
};

export default App;
