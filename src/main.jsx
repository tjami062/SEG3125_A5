import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Players from "./pages/Players.jsx";
import Goalies from "./pages/Goalies.jsx";
import Teams from "./pages/Teams.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/players" element={<Players />} />
        <Route path="/goalies" element={<Goalies />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);