import { FC } from "react";
import { Link } from "react-router-dom";
import useNetworkStatus from "../../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../../web3";
import { shortenAddress } from "../../../utils/stringUtils";
const AppBar: FC = () => {
  const { activate } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();
  return (
    <header className="shadow-xl bg-transparent bg-opacity-20 ">
      <nav className="flex items-center justify-between p-3 container mx-auto">
        <div className="flex items-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
          <Link to={"/"}>
            Swappery
            <span className=" text-indigo-400">DEX</span>
          </Link>
        </div>
        <div className="flex items-start">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link to={"/swap"}>
                Trade
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </Link>
              <ul className="p-2 bg-base-100">
                <li>
                  <Link to={"/swap"}>Swap</Link>
                </li>
                <li>
                  <Link to={"/liquidity"}>Liquidity</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={"/farms"}>
                Earn
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </Link>
              <ul className="p-2 bg-base-100">
                <li>
                  <Link to={"/liquidity"}>Farms</Link>
                </li>
                <li>
                  <Link to={"/liquidity"}>Pools</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={"/"}>Win</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <div className="mr-5 lg:mr-0">
            <button className="py-2 px-6 text-lg font-BwGradualDEMO inline-flex items-center"
              onClick={() => activate()}>
              {isConnected ? shortenAddress(activeAddress) : "Connect Wallet"}
            </button>
          </div>
          <div>
            <button className="py-2 px-6 text-lg font-BwGradualDEMO">
              Home
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default AppBar;
