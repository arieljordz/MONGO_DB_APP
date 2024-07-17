import "./App.css";
import React, { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Employee from "./components/Employee";
import Department from "./components/Department";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthProvider";
import Register from "./components/Register";

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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        closeButton={true}
      />
      <HashRouter>
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
            <Route path="/Register" element={<Register />} />
            <Route element={<RequireAuth />}>
              <Route path="/Layout" element={<Layout />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Employee" element={<Employee />} />
              <Route path="/Department" element={<Department />} />
            </Route>
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
