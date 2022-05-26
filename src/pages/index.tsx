import React from "react";
import Home from "./Home";
import Swap from "./Swap";
import Liquidity from "./Liquidity";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "../components";
export default function Pages() {
  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/swap' element={<Swap />} />
        <Route path='/liquidity' element={<Liquidity />} />
        <Route path='/add' element={<Liquidity />} />
        <Route path='/find' element={<Liquidity />} />
      </Routes>

      <Footer />
    </>
  );
}
