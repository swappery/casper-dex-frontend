/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useNetworkStatus from "../../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../../web3";
import { shortenAddress } from "../../../utils/utils";

import logo from "../../../assets/images/logo.svg";
import logoWhite from "../../../assets/images/logo-white.svg";
import swapperyIcon from "../../../assets/images/tokens/fe33392bf4d0ff2edbb5a664256271c03c9ed98da7a902472336a4c67cbb8f85.svg";
import swapperyDarkIcon from "../../../assets/images/tokens/token-dark.svg";
import useSetting from "../../../store/useSetting";
import { Themes } from "../../../config/constants/themes";
import WalletModal from "../../WalletModal/WalletModal";
import WalletIcon from "../../../components/Icon/Wallet";
import EscapeIcon from "../../../components/Icon/Escape";

const navigation = [
  { name: "Swap", href: "/swap" },
  { name: "Liquidity", href: "/liquidity" },
  { name: "Farm", href: "/farm" },
];

export default function Header() {
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const { theme, setTheme, swprPrice, setSwprPrice } = useSetting();
  const { activate, getSwapperyPrice } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  useEffect(() => {
    async function setPrice() {
      setSwprPrice(await getSwapperyPrice());
    }
    setPrice();
  }, []);

  document.documentElement.setAttribute("data-theme", theme);

  const handleToggle = () => {
    setNavbarOpen((prev) => !prev);
  };

  const handleClose = () => {
    setNavbarOpen(false);
  };

  return (
    <header className="grid grid-cols-3 border-b-[0.5px] border-neutral">
      <div className="col-span-3 xl:col-span-1 flex items-center justify-center bg-primary h-full py-8 px-4 border-b border-neutral xl:border-0">
        <NavLink to="/">
          <img src={theme === Themes.LIGHT ? logo : logoWhite} alt="Logo" />
        </NavLink>
      </div>
      <div className="col-span-2 bg-secondary hidden xl:block">
        <div className="grid grid-cols-2">
          <div className="flex justify-around items-center py-8 px-4 border-r-[0.5px] border-l-[0.5px] border-neutral text-neutral font-gotham z-10">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => (isActive ? "font-bold" : "")}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="flex justify-around items-center py-8 px-4 z-10">
            {isConnected ? (
              <ul className="menu menu-horizontal p-0">
                <li>
                  <div className="relative py-1.5 px-0 hover:bg-transparent">
                    <WalletIcon
                      background={theme === Themes.DARK ? "" : "lightyellow"}
                    />
                    <div
                      className={`flex items-center shadow rounded-2xl py-1 pr-2 pl-11 gap-1 ${
                        theme === Themes.DARK ? "bg-[#232323]" : "bg-[#eff4f5]"
                      }`}
                    >
                      <span className="text-neutral font-gotham font-bold">
                        {shortenAddress(activeAddress)}
                      </span>
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                      </svg>
                    </div>
                  </div>
                  <ul className="bg-accent border border-neutral left-0 sm:right-0 sm:left-auto font-orator-std text-neutral">
                    <li>
                      <a>Wallet</a>
                    </li>
                    <li>
                      <a>Recent Transactions</a>
                    </li>
                    <li className="border-t border-neutral">
                      <a className="flex justify-between">
                        <span>Disconnect</span>
                        <EscapeIcon
                          fill={theme === Themes.DARK ? "lightyellow" : "black"}
                        />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              <button
                className="hover:opacity-80 mb-1.5 sm:mb-1 ml-7 sm:ml-0 rounded-xl leading-[11px] md:leading-[16px] text-black font-orator-std text-[11px] xl:text-[13px] bg-lightyellow p-1 lg:px-3"
                onClick={() => activate()}
              >
                Connect Wallet
              </button>
            )}
            <div className="flex items-center gap-1">
              <NavLink to="/swap">
                <img
                  src={theme === Themes.LIGHT ? swapperyIcon : swapperyDarkIcon}
                  className="w-9 h-9 transform transition duration-500 hover:scale-110 hover:cursor-pointer"
                  alt="Swappery Icon"
                />
              </NavLink>
              <span className="text-neutral font-gotham font-bold">
                ${swprPrice}
              </span>
            </div>
            <div className="flex items-center">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  checked={theme === Themes.DARK ? true : false}
                  onChange={() => {
                    setTheme(
                      theme === Themes.DARK ? Themes.LIGHT : Themes.DARK
                    );
                  }}
                />
                <svg
                  className="swap-off fill-current w-6 h-6"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="black"
                  />
                  <path
                    d="M10.8 4.29999C11.4 5.19999 11.8 6.19999 11.8 7.39999C11.8 10.2 9.5 12.5 6.7 12.5C6.5 12.5 6.2 12.5 6 12.5C6.9 13.7 8.4 14.6 10.1 14.6C12.9 14.6 15.2 12.3 15.2 9.49999C15.2 6.79999 13.3 4.59999 10.8 4.29999Z"
                    fill="#FFF8D4"
                  />
                </svg>
                <svg
                  className="swap-on fill-current w-6 h-6"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#FFF8D4"
                  />
                  <path
                    d="M9.99995 12.5C11.2702 12.5 12.3 11.4702 12.3 10.2C12.3 8.92974 11.2702 7.89999 9.99995 7.89999C8.7297 7.89999 7.69995 8.92974 7.69995 10.2C7.69995 11.4702 8.7297 12.5 9.99995 12.5Z"
                    fill="black"
                  />
                  <path
                    d="M9.99985 6.79999C9.79985 6.79999 9.59985 6.59999 9.59985 6.39999V5.29999C9.59985 5.09999 9.79985 4.89999 9.99985 4.89999C10.1999 4.89999 10.3999 5.09999 10.3999 5.29999V6.39999C10.3999 6.69999 10.1999 6.79999 9.99985 6.79999Z"
                    fill="black"
                  />
                  <path
                    d="M9.99985 15.1C9.79985 15.1 9.59985 14.9 9.59985 14.7V13.6C9.59985 13.4 9.79985 13.2 9.99985 13.2C10.1999 13.2 10.3999 13.4 10.3999 13.6V14.7C10.3999 14.9 10.1999 15.1 9.99985 15.1Z"
                    fill="black"
                  />
                  <path
                    d="M14.7 10.4H13.6C13.4 10.4 13.2 10.2 13.2 10C13.2 9.80001 13.4 9.60001 13.6 9.60001H14.7C14.9 9.60001 15.1 9.80001 15.1 10C15.1 10.2 14.9 10.4 14.7 10.4Z"
                    fill="black"
                  />
                  <path
                    d="M6.3999 10.4H5.2999C5.0999 10.4 4.8999 10.2 4.8999 10C4.8999 9.80001 5.0999 9.60001 5.2999 9.60001H6.3999C6.5999 9.60001 6.7999 9.80001 6.7999 10C6.7999 10.2 6.6999 10.4 6.3999 10.4Z"
                    fill="black"
                  />
                  <path
                    d="M13.2998 13.7C13.1998 13.7 13.0998 13.7 12.9998 13.6L12.1998 12.8C11.9998 12.6 11.9998 12.4 12.1998 12.2C12.3998 12 12.5998 12 12.7998 12.2L13.5998 13C13.7998 13.2 13.7998 13.4 13.5998 13.6C13.4998 13.7 13.3998 13.7 13.2998 13.7Z"
                    fill="black"
                  />
                  <path
                    d="M7.5 7.9C7.4 7.9 7.3 7.9 7.2 7.8L6.4 7C6.2 6.8 6.2 6.6 6.4 6.4C6.6 6.2 6.8 6.2 7 6.4L7.8 7.2C8 7.4 8 7.6 7.8 7.8C7.7 7.9 7.6 7.9 7.5 7.9Z"
                    fill="black"
                  />
                  <path
                    d="M6.7 13.7C6.6 13.7 6.5 13.7 6.4 13.6C6.2 13.4 6.2 13.2 6.4 13L7.2 12.2C7.4 12 7.6 12 7.8 12.2C8 12.4 8 12.6 7.8 12.8L7 13.6C6.9 13.7 6.8 13.7 6.7 13.7Z"
                    fill="black"
                  />
                  <path
                    d="M12.4998 7.9C12.3998 7.9 12.2998 7.9 12.1998 7.8C11.9998 7.6 11.9998 7.4 12.1998 7.2L12.9998 6.4C13.1998 6.2 13.3998 6.2 13.5998 6.4C13.7998 6.6 13.7998 6.8 13.5998 7L12.7998 7.8C12.7998 7.9 12.5998 7.9 12.4998 7.9Z"
                    fill="black"
                  />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 grid grid-cols-2 bg-secondary xl:hidden">
        <div className="relative py-1.5 px-2 border-r border-neutral z-10">
          <label className="swap swap-rotate bg-lightyellow p-[5px]">
            <input type="checkbox" onChange={handleToggle} />
            <svg
              className="swap-off fill-current  w-[20px] h-[20px] xl:w-[30px] xl:h-[30px]"
              width="30"
              height="17"
              viewBox="0 0 30 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line y1="0.5" x2="30" y2="0.5" stroke="black" />
              <line y1="8.5" x2="30" y2="8.5" stroke="black" />
              <line y1="16.5" x2="30" y2="16.5" stroke="black" />
            </svg>

            <svg
              className="swap-on fill-current w-[20px] h-[20px] xl:w-[30px] xl:h-[30px]"
              width="19"
              height="30"
              viewBox="0 0 19 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0.5" y1="30" x2="0.5" stroke="black" />
              <line x1="18.5" y1="30" x2="18.5" stroke="black" />
              <line x1="9.5" x2="9.5" y2="30" stroke="black" />
            </svg>
          </label>
          <div className="dropdown absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {isConnected ? (
              <ul className="menu menu-horizontal p-0">
                <li>
                  <div className="relative py-1.5 px-0 hover:bg-transparent">
                    <WalletIcon
                      background={theme === Themes.DARK ? "" : "lightyellow"}
                    />
                    <div
                      className={`flex items-center shadow rounded-2xl py-1 pr-2 pl-11 gap-1 ${
                        theme === Themes.DARK ? "bg-[#232323]" : "bg-[#eff4f5]"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                      </svg>
                    </div>
                  </div>
                  <ul className="bg-accent border border-neutral left-0 sm:right-0 sm:left-auto font-orator-std text-neutral">
                    <li>
                      <a>Wallet</a>
                    </li>
                    <li>
                      <a>Recent Transactions</a>
                    </li>
                    <li className="border-t border-neutral">
                      <a className="flex justify-between">
                        <span>Disconnect</span>
                        <EscapeIcon
                          fill={theme === Themes.DARK ? "lightyellow" : "black"}
                        />
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              <button
                className="hover:opacity-80 mb-1.5 sm:mb-1 ml-7 sm:ml-0 rounded-xl leading-[11px] md:leading-[16px] text-black font-orator-std text-[11px] xl:text-[13px] bg-lightyellow p-1 lg:px-3"
                onClick={() => activate()}
              >
                Connect Wallet
              </button>
            )}
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-success rounded-box w-52"
            >
              <li
                onClick={() => {
                  setShowWalletModal(true);
                }}
              >
                Wallet
              </li>
              <li className="divide-solid"></li>
              <li>Disconnect</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center px-2">
          <NavLink to="/swap">
            <img
              src={theme === Themes.LIGHT ? swapperyIcon : swapperyDarkIcon}
              className="w-9 h-9 transform transition duration-500 hover:scale-110 hover:cursor-pointer"
              alt="Swappery Icon"
            />
          </NavLink>
          <span className="text-neutral font-gotham font-bold">
            ${swprPrice}
          </span>
          <div className="flex items-center">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={theme === Themes.DARK ? true : false}
                onChange={() => {
                  setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
                }}
              />
              <svg
                className="swap-off fill-current w-6 h-6"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                  fill="black"
                />
                <path
                  d="M10.8 4.29999C11.4 5.19999 11.8 6.19999 11.8 7.39999C11.8 10.2 9.5 12.5 6.7 12.5C6.5 12.5 6.2 12.5 6 12.5C6.9 13.7 8.4 14.6 10.1 14.6C12.9 14.6 15.2 12.3 15.2 9.49999C15.2 6.79999 13.3 4.59999 10.8 4.29999Z"
                  fill="#FFF8D4"
                />
              </svg>
              <svg
                className="swap-on fill-current w-6 h-6"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                  fill="#FFF8D4"
                />
                <path
                  d="M9.99995 12.5C11.2702 12.5 12.3 11.4702 12.3 10.2C12.3 8.92974 11.2702 7.89999 9.99995 7.89999C8.7297 7.89999 7.69995 8.92974 7.69995 10.2C7.69995 11.4702 8.7297 12.5 9.99995 12.5Z"
                  fill="black"
                />
                <path
                  d="M9.99985 6.79999C9.79985 6.79999 9.59985 6.59999 9.59985 6.39999V5.29999C9.59985 5.09999 9.79985 4.89999 9.99985 4.89999C10.1999 4.89999 10.3999 5.09999 10.3999 5.29999V6.39999C10.3999 6.69999 10.1999 6.79999 9.99985 6.79999Z"
                  fill="black"
                />
                <path
                  d="M9.99985 15.1C9.79985 15.1 9.59985 14.9 9.59985 14.7V13.6C9.59985 13.4 9.79985 13.2 9.99985 13.2C10.1999 13.2 10.3999 13.4 10.3999 13.6V14.7C10.3999 14.9 10.1999 15.1 9.99985 15.1Z"
                  fill="black"
                />
                <path
                  d="M14.7 10.4H13.6C13.4 10.4 13.2 10.2 13.2 10C13.2 9.80001 13.4 9.60001 13.6 9.60001H14.7C14.9 9.60001 15.1 9.80001 15.1 10C15.1 10.2 14.9 10.4 14.7 10.4Z"
                  fill="black"
                />
                <path
                  d="M6.3999 10.4H5.2999C5.0999 10.4 4.8999 10.2 4.8999 10C4.8999 9.80001 5.0999 9.60001 5.2999 9.60001H6.3999C6.5999 9.60001 6.7999 9.80001 6.7999 10C6.7999 10.2 6.6999 10.4 6.3999 10.4Z"
                  fill="black"
                />
                <path
                  d="M13.2998 13.7C13.1998 13.7 13.0998 13.7 12.9998 13.6L12.1998 12.8C11.9998 12.6 11.9998 12.4 12.1998 12.2C12.3998 12 12.5998 12 12.7998 12.2L13.5998 13C13.7998 13.2 13.7998 13.4 13.5998 13.6C13.4998 13.7 13.3998 13.7 13.2998 13.7Z"
                  fill="black"
                />
                <path
                  d="M7.5 7.9C7.4 7.9 7.3 7.9 7.2 7.8L6.4 7C6.2 6.8 6.2 6.6 6.4 6.4C6.6 6.2 6.8 6.2 7 6.4L7.8 7.2C8 7.4 8 7.6 7.8 7.8C7.7 7.9 7.6 7.9 7.5 7.9Z"
                  fill="black"
                />
                <path
                  d="M6.7 13.7C6.6 13.7 6.5 13.7 6.4 13.6C6.2 13.4 6.2 13.2 6.4 13L7.2 12.2C7.4 12 7.6 12 7.8 12.2C8 12.4 8 12.6 7.8 12.8L7 13.6C6.9 13.7 6.8 13.7 6.7 13.7Z"
                  fill="black"
                />
                <path
                  d="M12.4998 7.9C12.3998 7.9 12.2998 7.9 12.1998 7.8C11.9998 7.6 11.9998 7.4 12.1998 7.2L12.9998 6.4C13.1998 6.2 13.3998 6.2 13.5998 6.4C13.7998 6.6 13.7998 6.8 13.5998 7L12.7998 7.8C12.7998 7.9 12.5998 7.9 12.4998 7.9Z"
                  fill="black"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>
      <div
        className={`absolute w-full top-[131px] z-20 py-2 col-span-3 bg-info border-t border-b border-neutral grid text-center text-black ${
          navbarOpen ? "" : "hidden"
        }`}
      >
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            // onClick={handleClose}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <WalletModal
        show={showWalletModal}
        setShow={setShowWalletModal}
      ></WalletModal>
    </header>
  );
}
