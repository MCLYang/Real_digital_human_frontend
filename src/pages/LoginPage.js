// src/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    const Account = e.target.Account.value;
    const password = e.target.password.value;

    // 模拟登录逻辑
    if (Account === "admin" && password === "123456") {
      // navigate("/home"); // 跳转到主页面
      navigate("/admin/dashboard"); // 跳转到主页面
    } else {
      alert("用户名或密码错误！");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="Account" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Account
          </label>
          <input
            id="Account"
            name="Account"
            type="text"
            placeholder="Account Name"
            style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
