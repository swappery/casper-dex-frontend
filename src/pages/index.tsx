import React from "react";
import Home from "./Home";
import Swap from "./Swap";
import AddLiquidity from "./AddLiquidity";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "../components";
export default function Pages() {
  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/swap' element={<Swap />} />
        <Route path='/addLiquidity' element={<AddLiquidity />} />
      </Routes>

      <Footer />
    </>
  );
}
