import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ReactPaginate from "react-paginate";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Employee = () => {
  const [token, setToken] = useState(sessionStorage.getItem("AuthToken"));
  const [employeeId, setEmployeeId] = useState({});
  const [getEmployees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("Add");
  const [activeRow, setActiveRow] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [totalCount, setTotalCount] = useState(getEmployees.length);
  const [pageCount, setPageCount] = useState(Math.ceil(getEmployees.length / itemsPerPage));
  const navigate = useNavigate();

  const offset = currentPage * itemsPerPage;

  const filteredItems = getEmployees.filter(
    (obj) =>
      obj.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.middleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.department.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const currentItemsOnPage = filteredItems.slice(offset, offset + itemsPerPage);

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

  // console.log(employeeFormData);
  const [formData, setFormData] = useState(employeeFormData);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/Employee/GetAllEmployees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data);
      // console.log(res.data);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        navigate("/", { replace: true });
      } else {
        console.error("Error fetching employees:", error);
      }
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleShowModal = () => {
    setShowModal(true);
    setMode("Add");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(employeeFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(mode);
      if (mode === "Add") {
        // console.log(formData);
        const res = await axios.post("/api/Employee/CreateEmployee", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.status);
        if (res.status == 201) {
          toast.success("Successfully saved.");
          console.log("added");
          setFormData(employeeFormData);
          setTimeout(() => {
            fetchEmployees();
          }, 1000);
        } else {
          toast.error("Error in saving employee details.");
        }
      } else {
        // console.log(formData);
        const res = await axios.put(
          `/api/Employee/UpdateEmployee?id=${employeeId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(res.status);
        if (res.status == 204) {
          toast.success("Successfully updated.");
          setShowModal(false);
          console.log("updated");
          setFormData(employeeFormData);
          setTimeout(() => {
            fetchEmployees();
          }, 1000);
        } else {
          toast.error("Error in saving employee details.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.errors === undefined) {
        toast.error(
          "Error in saving employee details. with status = " +
            error.response.status
        );
      } else {
        toast.error(
          "Error in saving employee details. with status = " +
            error.response.status +
            " error: " +
            error.response.data.errors.Department[0]
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(formData);
  };

  const handleButtonActions = (action, Id, index) => {
    if (action == "update") {
      setShowModal(true);
      setMode("Update");
      fetchEmployeeById(Id);
    } else if (action == "delete") {
      handleDelete(Id);
    }
    setActiveRow(index);
  };

  const fetchEmployeeById = async (Id) => {
    try {
      const res = await axios.get(`/api/Employee/GetEmployeeById`, {
        params: {
          id: Id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);
      const getFormData = {
        Id: {},
        FirstName: res.data.firstName,
        MiddleName: res.data.middleName,
        LastName: res.data.lastName,
        Birthday: res.data.birthday,
        Department: res.data.department,
        Email: res.data.email,
        Password: res.data.password,
      };
      setEmployeeId(res.data.id);
      setFormData(getFormData);
      // console.log(res.data.birthday);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (Id) => {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to delete this record?",
      icon: "question",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`/api/Employee/DeleteEmployee`, {
            params: {
              id: Id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 204) {
              toast.success("Successfully deleted.");
              setTimeout(() => {
                fetchEmployees();
              }, 1500);
            } else {
              toast.error("Error while deleting employee.");
            }
          })
          .catch((error) => {
            toast.error("Error while deleting employee.");
          });
      } else if (result.dismiss == Swal.DismissReason.cancel) {
        //console.log("Cancelled");
      }
    });
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/Department/GetAllDepartments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(res.data);
      // console.log(res.data);
    } catch (error) {
      if (error.response && error.response.status == 401) {
        navigate("/", { replace: true });
      } else {
        console.error("Error fetching department:", error);
      }
    }
  };

  const getDepartmentNameById = (desc) => {
    const department = departments.find((dept) => dept.description === desc);
    return department ? department.description : "N/A";
  };

  const Pagination = (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      pageCount={pageCount}
      onPageChange={handlePageChange}
      containerClassName="pagination justify-content-end"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
    />
  );

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    setTotalCount(filteredItems.length);
    setPageCount(Math.ceil(filteredItems.length / itemsPerPage));
  }, [searchQuery, getEmployees, filteredItems, itemsPerPage]);

  return (
    <Layout>
      <div>
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title mb-0">
              <i className="fa fa-users pr-2" />
              Employee Details
            </h3>
          </div>
          <div className="card-body">
            <div className="row pl-2 pb-3">
              <button
                type="button"
                className="btn btn-secondary"
                data-toggle="modal"
                data-target="#modal-default"
                onClick={handleShowModal}
              >
                <i className="fa fa-plus mr-2" />
                Add New
              </button>
            </div>
            <div className="pb-3">
              <input
                type="text"
                className="form-control col-xs-3 col-sm-3 col-md-3 col-lg-3"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Employee"
              />
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                {
                  <div>
                    <div className="dataTables_wrapper table-responsive dt-bootstrap4">
                      <table
                        id="example2"
                        className="table table-bordered table-hover"
                        role="grid"
                        aria-describedby="example2_info"
                      >
                        <thead className="bg-secondary">
                          <tr role="row">
                            <th className="sorting text-center">Fullname</th>
                            <th className="sorting text-center">Email</th>
                            <th className="sorting text-center">Birthday</th>
                            <th className="sorting text-center">Department</th>
                            <th className="sorting text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItemsOnPage.length > 0 ? (
                            currentItemsOnPage.map((obj, index) => (
                              <tr
                                key={index}
                                className={
                                  activeRow === index ? "dt-active" : ""
                                }
                              >
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.firstName} {obj.middleName.charAt(0)}.{" "}
                                  {obj.lastName}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.email}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.birthday &&
                                    new Date(obj.birthday)
                                      .toISOString()
                                      .split("T")[0]}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  {getDepartmentNameById(obj.department)}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  <div className="row justify-content-center">
                                    <div className="dropdown dropleft">
                                      <button
                                        id="btnbars"
                                        type="button"
                                        className="btn btn-sm btn-primary btnbars"
                                        data-toggle="dropdown"
                                      >
                                        <i className="fa fa-bars" />
                                      </button>
                                      <div className="dropdown-menu">
                                        <div className="container fluid">
                                          <div className="pb-1">
                                            <button
                                              id="btnUpdate"
                                              type="button"
                                              className="btn btn-warning btn-sm col-sm-12"
                                              onClick={() =>
                                                handleButtonActions(
                                                  "update",
                                                  obj.id,
                                                  index
                                                )
                                              }
                                            >
                                              <i className="fa fa-edit mr-2" />
                                              Update
                                            </button>
                                          </div>
                                          <div className="">
                                            <button
                                              id="btnDelete"
                                              type="button"
                                              className="btn btn-danger btn-sm col-sm-12"
                                              onClick={() =>
                                                handleButtonActions(
                                                  "delete",
                                                  obj.id,
                                                  index
                                                )
                                              }
                                            >
                                              <i className="fa fa-trash mr-2" />
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5}></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="row">
                        <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                          <label
                            className="d-flex align-items-center"
                            style={{ fontWeight: "normal" }}
                          >
                            Show{" "}
                            <select
                              className="form-control mx-2 col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center"
                              value={itemsPerPage}
                              onChange={handleItemsPerPageChange}
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                            </select>
                            entries out of {totalCount} entries
                          </label>
                        </div>
                        <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                          {Pagination}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
      {/* modal */}

      <div>
        {showModal && (
          <div
            className={`modal fade ${showModal ? "show" : ""}`}
            id="modal-default"
            style={{ display: showModal ? "block" : "none" }}
            aria-hidden={!showModal}
            role="dialog"
            data-backdrop="static"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header bg-dark">
                    <h5 className="modal-title">
                      <i className="fa fa-users pr-2"></i>
                      {mode} Employee
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={handleCloseModal}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
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
                      type="submit"
                      className="btn btn-secondary float-right"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Employee;
