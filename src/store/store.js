import { configureStore } from "@reduxjs/toolkit";

import tableReducer from "../reducer/tableSlice";

const store = configureStore({
    reducer: {
        table: tableReducer,
    },
});

export default store;