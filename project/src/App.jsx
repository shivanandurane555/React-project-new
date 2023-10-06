import { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";

//states
const App = () => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setsortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit] = useState(4);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  const sortOptions = ["name", "address", "email", "phone", "status"];

  useEffect(() => {
    loadUserData(0, 4, 0);
  }, []);

  //load User Data
  const loadUserData = async (
    start,
    end,
    increase,
    optType = null,
    filterOrSortValue
  ) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setsortValue("");
        return await axios
          .get(
            `http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
      default:
        return await axios
          .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => console.log(err));
    }
  };

  console.log("data", data);

  const handleReset = () => {
    setOperation("");
    setValue("");
    loadUserData(0, 4, 0);
  };

  //Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    loadUserData(0, 4, 0, "search");
  };

  //sorting
  const handleSort = async (e) => {
    let value = e.target.value;
    setsortValue(value);
    return await axios
      .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

  //filter
  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:5000/users?status=${value}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if (data.length < 4 && currentPage === 0) return null;
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUserData(4, 8, 1, operation)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation
                )
              }
            >
              Previous
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage + 1) * 4,
                  (currentPage + 2) * 4,
                  1,
                  operation
                )
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData(
                  (currentPage - 1) * 4,
                  currentPage * 4,
                  -1,
                  operation
                )
              }
            >
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  return (
    <>
      <MDBContainer>
        <form
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center",
          }}
          className="d-flex input-group w-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <MDBBtn type="submit" color="dark">
            Search
          </MDBBtn>
          <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
            Reset
          </MDBBtn>
        </form>
        <div style={{ marginTop: "100px" }}>
          <h2>Search, Filter,Sort, Pagination</h2>
          <MDBRow>
            <MDBCol size={12}>
              <MDBTable>
                <MDBTableHead dark>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Address</th>
                    <th scope="col">Status</th>
                  </tr>
                </MDBTableHead>
                {data.length === 0 ? (
                  <MDBTableBody className="align-center mb-0">
                    <tr>
                      <td colSpan={8} className="text-center mb-0">
                        No data found
                      </td>
                    </tr>
                  </MDBTableBody>
                ) : (
                  data.map((item, index) => (
                    <MDBTableBody key={index}>
                      <tr>
                        <th scope="row">{index + 1} </th>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item.status}</td>
                      </tr>
                    </MDBTableBody>
                  ))
                )}
              </MDBTable>
            </MDBCol>
          </MDBRow>
          <div
            style={{
              margin: "auto",
              padding: "15px",
              maxWidth: "250px",
              alignContent: "center",
            }}
          >
            {renderPagination()}{" "}
          </div>
        </div>

        <MDBRow>
          <MDBCol size="8">
            <h5>Sort By:</h5>
            <select
              style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Please Select Value</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4">
            <h5>Filter By Status:</h5>
            <MDBBtnGroup>
              <MDBBtn color="success" onClick={() => handleFilter("Active")}>
                Active
              </MDBBtn>
              <MDBBtn
                color="danger"
                style={{ marginLeft: "2px" }}
                onClick={() => handleFilter("Inactive")}
              >
                Inactive
              </MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default App;
