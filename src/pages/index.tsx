import Home from "./home";
import Swap from "./swap";
import Liquidity from "./liquidity";
import Find from "./find";
import Add from "./add";
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
        <Route path='/add' element={<Add />} />
        <Route path='/find' element={<Find />} />
      </Routes>

      <Footer />
    </>
  );
}
