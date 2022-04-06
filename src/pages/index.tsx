import React from "react";
import Swap from "./Swap";
import AddLiquidity from "./AddLiquidity";
import { Routes, Route } from "react-router-dom";
export default function index() {
  return (
    <Routes>
      <Route path="/" element={<Swap />} />
      <Route path="/expenses" element={<AddLiquidity />} />
      <Route path="/invoices" element={<Swap />} />
    </Routes>
  );
}
