
import React from "react";
import ErrorBoundary from "./Components/Error/ErrorBoundaries";
import MainRouter from "./Routes/Router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store, { persistor } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <MainRouter />
            <Toaster />
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </>
  );
};

export default App;
