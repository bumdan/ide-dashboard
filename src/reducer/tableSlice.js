import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: [],
    lists: [],
    open: false,
    deleteDialog: false,
    selected: "",
    field: "",
    value: "",
    condition: "",
    field_type: "",
    editItem: null,
    deleteItem: null,
    searchInput: "",
    filterLists: [],
    title: "",
};

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setLists(state, action) {
            state.lists = action.payload;
        },
        setOpen(state, action) {
            state.open = action.payload;
        },
        setDeleteDialog(state, action) {
            state.deleteDialog = action.payload;
        },
        setSelected(state, action) {
            state.selected = action.payload;
        },
        setField(state, action) {
            state.field = action.payload;
        },
        setValue(state, action) {
            state.value = action.payload;
        },
        setEditItem(state, action) {
            state.editItem = action.payload;
        },
        setDeleteItem(state, action) {
            state.deleteItem = action.payload;
        },
        setSearchInput(state, action) {
            state.searchInput = action.payload;
        },
        setFilterLists(state, action) {
            state.filterLists = action.payload;
        },
        setTitle(state, action) {
            state.title = action.payload;
        },
        setCondition(state, action) {
            state.condition = action.payload;
        },
        setFieldtype(state, action) {
            state.field_type = action.payload;
        },
        setCount(state, action) {
            state.count = action.payload;
        }
    },
});

export const {
    setDeleteDialog,
    setDeleteItem,
    setEditItem,
    setField,
    setFilterLists,
    setLists,
    setOpen,
    setSearchInput,
    setSelected,
    setValue,
    setTitle,
    setCondition,
    setFieldtype,
    setCount,
} = tableSlice.actions;

export default tableSlice.reducer;