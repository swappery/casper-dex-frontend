import React from "react";
import Landing from "./Landing";
import Swap from "./Swap";
import AddLiquidity from "./AddLiquidity";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Header, Footer } from "../components";
export default function Pages() {
  const { pathname } = useLocation();

  const tabClass = "tab tab-lg tab-bordered ";
  const tabActiveClass = tabClass + "tab-active";
  return (
    <>
      <Header />
      <div className="container mx-auto mt-3">
        <div className="tabs justify-center">
          <Link
            className={pathname === "/swap" ? tabActiveClass : tabClass}
            to={"/swap"}
          >
            Swap
          </Link>
          <Link
            className={pathname === "/addLiquidity" ? tabActiveClass : tabClass}
            to={"/addLiquidity"}
          >
            Liquidity
          </Link>
          <Link
            className={pathname === "/" ? tabActiveClass : tabClass}
            to={"/"}
          >
            Perpetual
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/addLiquidity" element={<AddLiquidity />} />
      </Routes>
      <Footer />
    </>
  );
}
