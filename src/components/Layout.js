import "../App.css";
import React, { useEffect, useState } from "react";
import DateTimeDisplay from "../custom/DateTimeDisplay";
import { useNavigate } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(sessionStorage.getItem("UserId"));
  const [email, setEmail] = useState(sessionStorage.getItem("Email"));

  const handleSignOut = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("AuthToken");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("Email");
    setEmail(null);
    setUserId(null);
    navigate("/", { replace: true });
  };

  useEffect(() => {}, []);

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
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fa fa-user-circle-o" />
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fa fa-vcard-o mr-2" /> Profile
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fa fa-gear mr-2" /> Settings
              </a>
              <div className="dropdown-divider" />
              <a href="/" className="dropdown-item" onClick={handleSignOut}>
                <i className="fa fa-sign-out mr-2" /> Sign Out
              </a>
            </div>
          </li>
        </ul>
      </nav>

      {/* SideBar */}
      {/* <aside className="main-sidebar sidebar-dark-primary elevation-4"> */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">CRUD APP</span>
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
              <a className="d-block">{email}</a>
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
                  to="/Dashboard"
                >
                  <i className="nav-icon fa fa-bar-chart" />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/Home">
                  <i className="nav-icon fa fa-building-o" />
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/Employee"
                >
                  <i className="nav-icon fa fa-users" />
                  Employee
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/Department"
                >
                  <i className="nav-icon fa fa-folder-open" />
                  Department
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {/* <aside className="control-sidebar control-sidebar-dark"></aside> */}
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
