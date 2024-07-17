import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("AuthToken"));
  const [departments, setDepartments] = useState([]);

  const employeeFormData = {
    Id: {},
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Birthday: "",
    Department: "",
    Email: "",
    Password: "",
  };

  const [formData, setFormData] = useState(employeeFormData);

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
      const res = await axios.post("/api/Employee/CreateEmployee", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.status);
      if (res.status == 201) {
        toast.success("Successfully registered.");
        setFormData(employeeFormData);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else {
        toast.error("Error in saving employee details.");
      }
    } catch (error) {
      if (error.response && error.response.status == 401) {
        toast.error("Department is required.");
      } else {
        toast.error("Department is required.");
        console.error("Error in saving employee:", error);
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/Department/GetAllDepartments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(res.data);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        toast.error(error.response.status);
      } else {
        console.error("Error fetching department:", error);
      }
    }
  };

  const handleBack = async () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    fetchDepartments();
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
                <label className="text-secondary">Register</label>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <input type="hidden" id="Id" value={formData.Id} />
                <div className="row">
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="FirstName">FirstName</div>
                      <input
                        type="text"
                        name="FirstName"
                        className="form-control"
                        id="FirstName"
                        autoComplete="off"
                        required="required"
                        value={formData.FirstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="MiddleName">MiddleName</div>
                      <input
                        type="text"
                        name="MiddleName"
                        className="form-control"
                        id="MiddleName"
                        required="required"
                        value={formData.MiddleName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="LastName">LastName</div>
                      <input
                        type="text"
                        name="LastName"
                        className="form-control"
                        id="LastName"
                        required="required"
                        value={formData.LastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="Birthday">Birthday</div>
                      <input
                        type="date"
                        name="Birthday"
                        className="form-control"
                        id="Birthday"
                        required="required"
                        value={
                          formData.Birthday
                            ? formData.Birthday.substring(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div>Department</div>
                      <select
                        value={formData.Department}
                        className="form-control"
                        name="Department"
                        onChange={handleChange}
                        required="required"
                      >
                        <option value="">--Select--</option>
                        {departments.map((option) => (
                          <option
                            key={option.id}
                            id={option.id}
                            value={option.description}
                          >
                            {option.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="Email">Email</div>
                      <input
                        type="email"
                        name="Email"
                        className="form-control"
                        id="Email"
                        required="required"
                        value={formData.Email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <div className="form-group">
                      <div htmlFor="Password">Password</div>
                      <input
                        type="password"
                        name="Password"
                        className="form-control"
                        id="Password"
                        required="required"
                        value={formData.Password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-secondary float-right">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
