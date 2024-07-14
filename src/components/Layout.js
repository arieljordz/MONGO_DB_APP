import React, { useEffect, useState } from "react";
import DateTimeDisplay from "../custom/DateTimeDisplay";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("jordz");
  const [userId, setUserId] = useState(0);
  

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://localhost:7182/Logout/" + userId);
      if (res.status === 200) {
        setUsername("");
        setUserId(0);
        navigate("/");
      }
    } catch (error) {}
  };

  useEffect(() => {
    
  }, []);

  return (
    <div>
      {/* Header */}
      <nav className="main-header navbar navbar-expand navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href=""
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link text-bold text-blink">
              <DateTimeDisplay />
            </a>
          </li>
        </ul>
      </nav>

      {/* SideBar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">POS</span>
        </a>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a className="d-block">{username}</a>
            </div>
          </div>
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/dashboard"
                >
                  <i className="nav-icon fa fa-area-chart" />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/home">
                  <i className="nav-icon fa fa-building-o" />
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/employee"
                >
                  <i className="nav-icon fa fa-user" />
                  Employee
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/department"
                >
                  <i className="nav-icon fa fa-folder-open" />
                  Department
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <aside className="control-sidebar control-sidebar-dark"></aside>
      {/* Content */}
      <div className="content-wrapper">{children}</div>
      {/* <div className="content-wrapper"><Outlet/></div> */}
      {/* Footer */}
      <footer className="main-footer fixed-bottom bg-dark">
        <strong>
          Copyright © 2024{" "}
          <a href="https://www.facebook.com/arieljordz">Jordz Production</a>.{" "}
        </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.0
        </div>
      </footer>
    </div>
  );
}

export default Layout;
