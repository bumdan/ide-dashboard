import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, InputAdornment} from "@mui/material";
import Header from "components/Headers/Header";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Table, Container, Row, Button, CardFooter, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { setCount, setDeleteDialog, setDeleteItem , setEditItem, setFilterLists, setSearchInput } from "reducer/tableSlice";
import { MY_TOKEN } from "components/config";
import axios from "axios";

const Township = () => {
  const url = "http://localhost:8081/township";
  const [lists, setLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [township, setTownship] = useState("");
  const [error, setError] = useState(false);
  const [region, setRegion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { deleteDialog, count, deleteItem, editItem, searchInput, filterLists } = useSelector((state) => state.table);

  const getData = async () => {
    const token = MY_TOKEN;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    };

    const data = await response.json();
    console.log(data);
    setLists(data.items);
    dispatch(setCount(data.count));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddClick = () => {
    setOpen(true);
    setTitle("Add Township");
    setRegion("");
    setTownship("");
    setError(false);
  };

  const handleEdit = (_id) => {
    const item = lists.find((items) => items._id === _id);
    setRegion(item.region);
    setTownship(item.township);
    dispatch(setEditItem(_id));
    setOpen(true);
    setTitle("Edit Township");
    setError(false);
  };

  const handleDeleted = (_id) => {
    dispatch(setDeleteItem(_id));
    dispatch(setDeleteDialog(true));
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${url}/${deleteItem}`, {
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`
        },
      });
      setLists(lists.filter(item => item._id !== deleteItem));
      dispatch(setDeleteDialog(false));
    } catch (error) {
      console.log("Error during deletion:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setDeleteDialog(false));
  };

  const validate = (value) => {
    const regex = /^[A-Z]{3}$/;
    return regex.test(value)
  };

  const handleOnChange = (e) => {
    const input = e.target.value;
    setTownship(input);
    setError(!validate(input));
  };

  const handleSubmit = async () => {
    if (!validate(township)) {
      return setError("Must be 3 alphabet!");
    }

    try {
      const regionNumber = parseInt(region);
      const payload = { region: regionNumber, township: township };

      if (editItem) {
        await axios.patch(`${url}/${editItem}`, payload, {
          headers: {
            Authorization: `Bearer ${MY_TOKEN}`
          },
        });
        console.log("edit_id:", editItem)
      } else {
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${MY_TOKEN}`,
          },
        });
      }
      await getData();
      handleClose();
    } catch (error) {
      console.log("Error creating township:", error);
    }
  };

  const handleSearchChange = (e) => {

    const searchTerm = e.target.value;
    dispatch(setSearchInput(searchTerm));

    if (searchTerm.trim() !== "") {
      const filtered = lists.filter(items =>
        items.township.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch(setFilterLists(filtered));
      setCurrentPage(1);
    } else {
      dispatch(setFilterLists([]));
    }
  };

  const clearSearch = () => {
    dispatch(setSearchInput(""));
    dispatch(setFilterLists([]));
    setCurrentPage(1);
  };

  // Calculate pagination
  const itemsPerPage = 7;
  const lastItem = currentPage * itemsPerPage;
  const firstItem = lastItem - itemsPerPage;
  const currentItems = lists.slice(firstItem, lastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">Township Table ({count})</h2>
                </div>
                <div className="d-flex justify-content-space-between">
                <TextField
                    label="Search"
                    margin="normal"
                    value={searchInput}
                    onChange={handleSearchChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {searchInput ? (
                            <Tooltip title="Clear">
                              <IconButton onClick={clearSearch}>
                                <ClearIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Search">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </InputAdornment>
                      )
                    }}
                  />
                  <Tooltip title="Add">
                    <IconButton onClick={handleAddClick}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"><h3>Region</h3></th>
                    <th scope="col"><h3>Township</h3></th>
                    <th scope="col"><h3>Action</h3></th>
                  </tr>
                </thead>
                <tbody>
                  {(filterLists.length > 0 ? filterLists : currentItems).map(item => (
                    <tr key={item._id}>
                      <td><h4>{item.region}</h4></td>
                      <td><h4>({item.township})</h4></td>
                      <td>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(item._id)} onClose={handleClose} ><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleted(item._id)} onClose={handleClose} ><DeleteIcon /></IconButton>
                        </Tooltip>
                      </td>
                      <td>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(Math.ceil(lists.length / itemsPerPage)).keys()].map((number) => (
                      <PaginationItem key={number} active={number + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(number + 1)}>{number + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentItems.length < itemsPerPage}>
                      <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{title}</DialogTitle>
              <DialogContent>
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Region Code</InputLabel>
                  <Select
                    label="Region Code"
                    fullWidth
                    value={region}
                    onChange={(e) => {
                      const input = e.target.value;
                      setRegion(input)
                    }}
                  >
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Township"
                  fullWidth
                  value={township}
                  onChange={handleOnChange}
                  error={error}
                  helperText={error ? "Must be 3 alphabet!" : ""}
                />
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
                <Button color="secondary" onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={deleteDialog} onClose={handleClose}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                {deleteItem && (
                  <DialogContentText>
                    you want to delete ({lists.find(item => item._id === deleteItem)?.township})
                  </DialogContentText>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={confirmDelete} color="primary">
                  Delete
                </Button>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Township;