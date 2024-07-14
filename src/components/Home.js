import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ReactPaginate from "react-paginate";
import Layout from './Layout';

const Home = () => {
  const [getEmployees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const pageCount = Math.ceil(getEmployees.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;

  const filteredItems = getEmployees.filter((obj) =>
    obj.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItemsOnPage = filteredItems.slice(offset, offset + itemsPerPage);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/Employee/GetAllEmployees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleButtonActions = (action, Id) => {
    if (action === "update") {
      alert("updated");
    } else if (action === "delete") {
      alert("deleted");
      //   handleDelete(Id);
    }
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
      containerClassName="pagination"
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
  }, []);

  return (
    <Layout>
      <div>
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title mb-0">
              <i className="fa fa-user pr-2" />
              Employee Details
            </h3>
          </div>
          <div className="card-body">
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
                            <th className="sorting text-center">Birthday</th>
                            <th className="sorting text-center">Position</th>
                            <th className="sorting text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItemsOnPage.length > 0 ? (
                            currentItemsOnPage.map((obj, key) => (
                              <tr key={key}>
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.firstName} {obj.middleName.charAt(0)}.{" "}
                                  {obj.lastName}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.birthday &&
                                    new Date(obj.birthday).toLocaleDateString(
                                      "en-US"
                                    )}
                                </td>
                                <td className="dtr-control sorting_1 text-center">
                                  {obj.positionId}
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
                                                  obj.id
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
                                                  obj.id
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
                              <td colSpan={6}></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
    </Layout>
  );
};
export default Home;
