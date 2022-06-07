import Home from "./home";
import Swap from "./swap";
import Liquidity from "./liquidity";
import Find from "./find";
import Add from "./add";
import Remove from "./remove";
import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "../components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Pages() {
  // const es = new EventStream(EVENT_STREAM_ADDRESS!);

  // es.subscribe(EventName.DeployProcessed, (event) => {
  //   const parsedEvents = CEP47EventParser({
  //     contractPackageHash,
  //     eventNames: [
  //       CEP47Events.MintOne,
  //       CEP47Events.TransferToken,
  //       CEP47Events.BurnOne,
  //       CEP47Events.MetadataUpdate,
  //       CEP47Events.ApproveToken
  //     ]
  //   }, event);

  //   if (parsedEvents && parsedEvents.success) {
  //     console.log("*** EVENT ***");
  //     console.log(parsedEvents.data);
  //     console.log("*** ***");
  //   }
  // });

  // es.start();
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
      </Routes>
      <ToastContainer />

      <Footer />
    </>
  );
}
