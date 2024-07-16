import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();
  const [userId, setUserId] = useState(sessionStorage.getItem("UserId"));

  // console.log(userId);
  const _userId = userId == null ? "" : userId;

  if (_userId !== "") {
    return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
}

export default RequireAuth;
