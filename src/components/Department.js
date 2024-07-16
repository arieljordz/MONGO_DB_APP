import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ReactPaginate from "react-paginate";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Department = () => {
  const [token, setToken] = useState(sessionStorage.getItem("AuthToken"));
  const [departmentId, setDepartmentId] = useState({});
  const [getDepartments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("Add");
  const [activeRow, setActiveRow] = useState(null);
  const [totalCount, setTotalCount] = useState(getDepartments.length);
  const [pageCount, setPageCount] = useState(Math.ceil(getDepartments.length / itemsPerPage));
  const navigate = useNavigate();

  const offset = currentPage * itemsPerPage;

  const filteredItems = getDepartments.filter(
    (obj) =>
      obj.description.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const currentItemsOnPage = filteredItems.slice(offset, offset + itemsPerPage);

  const departmentFormData = {
    Id: {},
    Description: "",
  };

  // console.log(departmentFormData);
  const [formData, setFormData] = useState(departmentFormData);

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
    setFormData(departmentFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(mode);
      if (mode === "Add") {
        // console.log(formData);
        const res = await axios.post("/api/Department/CreateDepartment", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.status);
        if (res.status == 201) {
          toast.success("Successfully saved.");
          console.log("added");
          setFormData(departmentFormData);
          setTimeout(() => {
            fetchDepartments();
          }, 1000);
        } else {
          toast.error("Error in saving department details.");
        }
      } else {
        // console.log(formData);
        const res = await axios.put(
          `/api/Department/UpdateDepartment?id=${departmentId}`,
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
          setFormData(departmentFormData);
          setTimeout(() => {
            fetchDepartments();
          }, 1000);
        } else {
          toast.error("Error in saving department details.");
        }
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(
        "Error in saving department details. with status = " +
          error.response.status
      );
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
      fetchDepartmentById(Id);
    } else if (action == "delete") {
      handleDelete(Id);
    }
    setActiveRow(index);
  };

  const fetchDepartmentById = async (Id) => {
    try {
      const res = await axios.get(`/api/Department/GetDepartmentById`, {
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
        Description: res.data.description,
      };
      setDepartmentId(res.data.id);
      setFormData(getFormData);
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
          .delete(`/api/Department/DeleteDepartment`, {
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
                fetchDepartments();
              }, 1500);
            } else {
              toast.error("Error while deleting department.");
            }
          })
          .catch((error) => {
            toast.error("Error while deleting department.");
          });
      } else if (result.dismiss == Swal.DismissReason.cancel) {
        //console.log("Cancelled");
      }
    });
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
    fetchDepartments();
    fetchDepartments();
    setTotalCount(filteredItems.length);
    setPageCount(Math.ceil(filteredItems.length / itemsPerPage));
  }, [searchQuery, getDepartments, filteredItems, itemsPerPage]);

  return (
    <Layout>
      <div>
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title mb-0">
              <i className="fa fa-folder-open pr-2" />
              Department Details
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
                placeholder="Search Department"
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
                                  {obj.description}
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
                              <td colSpan={2}></td>
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
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header bg-dark">
                    <h5 className="modal-title">
                      <i className="fa fa-folder-open pr-2"></i>
                      {mode} Department
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
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                          <div htmlFor="Description">Description</div>
                          <input
                            type="text"
                            name="Description"
                            className="form-control"
                            id="Description"
                            autoComplete="off"
                            required="required"
                            value={formData.Description}
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
export default Department;
