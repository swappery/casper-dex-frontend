import React from "react";
import Pages from "./pages";
import { BrowserRouter } from "react-router-dom";
import "./web3/clients/eventStreamer";

function App() {
  return (
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  );
}

export default App;
