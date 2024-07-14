import React, { useRef, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const Login = ({ onLoginSuccess }) => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
    //console.log(formData);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("/api/Employee/Login", formData);
      console.log(res);
  
      if (res.data.isSuccess) {
        sessionStorage.setItem("Username", res.data.fullName);
        sessionStorage.setItem("UserId", res.data.id);
        setSuccess(true);
        onLoginSuccess(true);
        setAuth(true);
        navigate("/Home", { replace: true });
        
        // Clear form data after successful login
        setFormData({
          Email: "",
          Password: "",
        });
      } else {
        setErrMsg("Log in failed");
        setSuccess(false);
        onLoginSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrMsg("Log in failed");
      setSuccess(false);
      onLoginSuccess(false);
    }
  
    errRef.current.focus();
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
              <p
                ref={errRef}
                className={errMsg ? "text-danger text-center" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
