/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import { IconButton, InputAdornment, TextField, Tooltip, Dialog, DialogActions, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, DialogContentText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeleteDialog,
  setEditItem,
  setCount,
  setField,
  setFilterLists,
  setLists,
  setOpen,
  setSearchInput,
  setSelected,
  setValue,
  setTitle,
  setFieldtype,
  setCondition,
} from "reducer/tableSlice"
import { MY_TOKEN } from "components/config";

const Tables = () => {
  // const url = "http://localhost:3030/result";
  const url = "http://localhost:8081/etr-criteria";
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteItem, setDeleteItem] = useState(null);
  const dispatch = useDispatch();
  const {
    lists,
    open,
    deleteDialog,
    selected,
    field,
    value,
    editItem,
    searchInput,
    filterLists,
    title,
    field_type,
    condition,
    count,
  } = useSelector((state) => state.table);

  const handleAddClick = () => {
    dispatch(setOpen(true));
    dispatch(setTitle("Add Item"));
    dispatch(setEditItem(null));
    dispatch(setField(""));
    dispatch(setSelected(""));
    dispatch(setValue(""));
    dispatch(setCondition(""));
    dispatch(setFieldtype(""))
  };

  const handleEdit = (_id) => {
    const item = lists.find((items) => items._id === _id);
    dispatch(setField(item.field));
    dispatch(setSelected(item.operator));
    dispatch(setValue(item.value));
    dispatch(setCondition(item.condition));
    dispatch(setFieldtype(item.field_type));
    dispatch(setOpen(!open));
    dispatch(setTitle("Edit Item"));
    dispatch(setEditItem(_id));
  };

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
    dispatch(setLists(data.items));
    dispatch(setCount(data.count));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleted = (_id) => {
    dispatch(setDeleteDialog(true));
    setDeleteItem(_id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${url}/${deleteItem}`, {
        headers: {
          Authorization: `Bearer ${MY_TOKEN}`
        },
      });
      dispatch(setLists(lists.filter(item => item._id !== deleteItem)));
      dispatch(setDeleteDialog(false));
    } catch (error) {
      console.log("Error during deletion:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { condition: condition, field: field, operator: selected, value: value, field_type: field_type };

      if (editItem) {
        await axios.patch(`${url}/${editItem}`, payload, {
          headers: {
            Authorization: `Bearer ${MY_TOKEN}`
          },
        });
        console.log(editItem);
      } else {
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${MY_TOKEN}`
          },
        });
      }
      await getData();
      dispatch(setOpen(!open));
    } catch (error) {
      console.error("Error form sub:", error);
    }
  };

  const handleSearchChange = (e) => {

    const searchTerm = e.target.value;
    dispatch(setSearchInput(searchTerm));

    if (searchTerm.trim() !== "") {
      const filtered = lists.filter(item =>
        item.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleClose = () => {
    dispatch(setOpen(false));
    dispatch(setDeleteDialog(false));
  }

  const isDisable = !field.trim() || !value.trim();

  // Calculate pagination
  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lists.slice(indexOfFirstItem, indexOfLastItem);

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
                  <h2 className="mb-0">ETR Criteria ({count})</h2>
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
                    <th scope="col"><h3>Field</h3></th>
                    <th scope="col"><h3>Operator</h3></th>
                    <th scope="col"><h3>Value</h3></th>
                    <th scope="col"><h3>Action</h3></th>
                  </tr>
                </thead>
                <tbody>
                  {(filterLists.length > 0 ? filterLists : currentItems).slice().reverse().map(item => (
                    <tr key={item._id}>
                      <td><h4>{item.field}</h4></td>
                      <td><h4>{item.operator}</h4></td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <h4>{item.value}</h4>
                        </Badge>
                      </td>
                      <td>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(item._id)}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleted(item._id)}><DeleteIcon /></IconButton>
                        </Tooltip>
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
                <TextField
                  label="condition"
                  margin="normal"
                  fullWidth
                  value={condition}
                  onChange={(e) => {
                    const input = e.target.value;
                    dispatch(setCondition(input))
                  }}
                />
                <TextField
                  label="Field"
                  margin="normal"
                  fullWidth
                  value={field}
                  onChange={(e) => {
                    const input = e.target.value;
                    dispatch(setField(input))
                  }}
                />
                <FormControl margin="normal" fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    label="Operators"
                    value={selected}
                    onChange={(e) => {
                      const input = e.target.value;
                      dispatch(setSelected(input))
                    }}
                  >
                    <MenuItem value="=">{'='}</MenuItem>
                    <MenuItem value=">">{'>'}</MenuItem>
                    <MenuItem value="<">{'<'}</MenuItem>
                    <MenuItem value=">=">{'>='}</MenuItem>
                    <MenuItem value="<=">{'<='}</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Value"
                  margin="normal"
                  fullWidth
                  value={value}
                  onChange={(e) => {
                    const input = e.target.value;
                    dispatch(setValue(input));
                  }}
                />
                <TextField
                  label="field_type"
                  margin="normal"
                  fullWidth
                  value={field_type}
                  onChange={(e) => {
                    const input = e.target.value;
                    dispatch(setFieldtype(input));
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSubmit} color="primary" disabled={isDisable}>Submit</Button>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={deleteDialog} onClose={handleClose}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                {deleteItem && (
                  <DialogContentText>
                    {lists.find(item => item._id === deleteItem)?.field}
                    {lists.find(item => item._id === deleteItem)?.operator}
                    {lists.find(item => item._id === deleteItem)?.value}
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

export default Tables;
