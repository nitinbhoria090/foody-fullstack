// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { Toaster } from "react-hot-toast";

// import App from "./App";
// import "./index.css";
// import { store } from "./redux/store";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>

//         <Toaster
//           position="top-right"
//           reverseOrder={false}
//         />

//         <App />

//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>
// );


import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { UserProvider } from "./context/userContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
      <UserProvider>
        <App />
        <Toaster/>
      </UserProvider>
  </StrictMode>
);