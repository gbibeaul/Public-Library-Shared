import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/Store.js";
import "./css/index.css";
import App from "./App";
import "./I18n.js";

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);
