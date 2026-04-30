import React from "react";
import { createRoot } from "react-dom/client";
import SwagRunnerNightCityGame from "./SwagRunnerNightCityGame.jsx";
import "./style.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SwagRunnerNightCityGame />
  </React.StrictMode>
);
