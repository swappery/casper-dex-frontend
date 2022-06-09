import Home from "./home";
import Swap from "./swap";
import Liquidity from "./liquidity";
import Find from "./find";
import Add from "./add";
import Remove from "./remove";
import Farm from "./farm";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "../components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { getCustomMeta } from "../config/constants/meta";
import useSetting from "../store/useSetting";
export default function Pages() {
  const location = useLocation();
  const pageMeta = getCustomMeta(location.pathname);
  const { swprPrice } = useSetting();
  const pageTitle = [pageMeta.title, swprPrice].join(" - $");
  document.title = pageTitle;
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/add" element={<Add />} />
        <Route path="/find" element={<Find />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/farm" element={<Farm />} />
      </Routes>
      <ToastContainer />

      <Footer />
    </>
  );
}
