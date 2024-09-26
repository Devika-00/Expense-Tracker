import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);
const store = configureStore({
  reducer: {
    user: persistedReducer,  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
export const persistor = persistStore(store);
