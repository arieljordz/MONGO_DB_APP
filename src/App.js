import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Employee from "./components/Employee";
import Department from "./components/Department";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const storedSuccess = sessionStorage.getItem("success");
    if (storedSuccess) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    sessionStorage.setItem("success", true);
  };
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="wrapper" value={isLoggedIn}>
          <div
            id="loader"
            className="preloader flex-column justify-content-center align-items-center"
          >
            <img
              className="animation__wobble"
              src="dist/img/AdminLTELogo.png"
              alt="AdminLTELogo"
              height={60}
              width={60}
            />
          </div>
          <Routes>
            <Route
              path="/"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route element={<RequireAuth />}>
              <Route path="/layout" element={<Layout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/department" element={<Department />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
