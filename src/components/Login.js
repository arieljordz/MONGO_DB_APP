import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";

const Login = ({ onLoginSuccess }) => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/Employee/Login", formData);

      if (res.data.isSuccess) {
        setFormData({
          Email: "",
          Password: "",
        });

        sessionStorage.setItem("UserId", res.data.userId);
        sessionStorage.setItem("Email", res.data.email);
        sessionStorage.setItem("AuthToken", res.data.token);
        setSuccess(true);
        onLoginSuccess(true);
        setAuth(true);
        setToken(res.data.token);

        navigate("/Employee", { replace: true });
      } else {
        Swal.fire("Warning", "Log in failed.", "warning");
        setSuccess(false);
        onLoginSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", error.message, "info");
      setSuccess(false);
      onLoginSuccess(false);
    }
  };

  const handleRegister = (e) => {
    navigate("/Register", { replace: true });
  };

  useEffect(() => {
    setErrMsg("");
  }, []);

  return (
    <>
      <section>
        <div
          className="row d-flex justify-content-center"
          style={{ paddingTop: 200 }}
        >
          <div className="card">
            <div className="card-header bg-success-origin">
              <div className="card-title">
                <label className="text-secondary">Login Details</label>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="Email"
                    autoComplete="off"
                    onChange={handleChange}
                    value={formData.Email}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="Password"
                    onChange={handleChange}
                    value={formData.Password}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn btn-block btn-secondary btn-md"
                    defaultValue="Login"
                  />
                </div>
              </form>
              <div className="d-flex justify-content-end">
                <a className="a-tag a-tag-bold" onClick={handleRegister}>Register</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
