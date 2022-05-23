import { Link } from "react-router-dom";
import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import { shortenAddress } from "../../utils/stringUtils";
import useTheme, { Themes } from "../../hooks/useTheme";
import TokenomicsTable from "./components/TokenomicsTable";
import "./home.css";
import logo from "../../assets/images/logo-huge.png";
import logoWhite from "../../assets/images/logo-huge-white.png";
import greenHand from "../../assets/images/hands/green-hand.svg";
import pinkHand from "../../assets/images/hands/pink-hand.svg";
import pinkHandDark from "../../assets/images/hands/pink-hand-dark.svg";
import blueHand from "../../assets/images/hands/blue-hand.svg";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { activate } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();

  return (
    <div className='bg-accent overflow-hidden'>
      <div className='relative'>
        <div className='2xl:container 2xl:mx-auto relative'>
          <img
            src={blueHand}
            className='absolute -top-28 left-8 z-10'
            alt='Blue Hand'
          />
          <img
            src={greenHand}
            className='absolute top-[5px] left-[555px]'
            alt='Green Hand'
          />
          <img
            src={theme === Themes.LIGHT ? pinkHand : pinkHandDark}
            className='absolute bottom-12 right-10 z-10'
            alt='Pink Hand'
          />
          <div className='absolute border-t border-b border-black bg-white w-full h-[58px] top-[167px] left-[648px]'></div>
          <div className='max-w-[640px] pl-[40px] pt-[150px] pb-[150px] text-neutral'>
            <p className='font-orator-std text-[70px] leading-[84px] text-center'>
              TIME TO GET SWAPPY!
            </p>
            <div className='max-w-[450px] mx-auto'>
              <p className='font-gotham text-[20px] mt-7 mb-5'>
                Swap, trade, and earn crypto on the coolest decentralized
                swappery in town.
              </p>
              <div className='flex gap-4 font-orator-std'>
                <button
                  className='text-black text-[18px] rounded-2xl bg-lightblue py-0.5 px-3'
                  onClick={() => activate()}>
                  {isConnected
                    ? shortenAddress(activeAddress)
                    : "Connect Wallet"}
                </button>
                <Link
                  to='/swap'
                  className='rounded-2xl border border-neutral leading-[26px] px-3 font-medium'>
                  TRADE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='text-center text-neutral pb-[100px] relative'>
        <p className='font-orator-std text-[56px] leading-[68px] max-w-[1030px] mx-auto pb-6'>
          THE FIRST AND ONLY CROSS-CHAIN DEX ON CASPER NETWORK & BSC!
        </p>
        <p className='font-gotham text-[20px] leading-[24px] max-w-[830px] mx-auto'>
          At The Swapperry, we are building a MultiChain Dex, starting with BSC
          and Casper – and then moving to Fantom, Terra, ETH, and others.
        </p>

        <img
          src={theme === Themes.LIGHT ? logo : logoWhite}
          className='animate-slide'
          alt='Swappery Logo'
        />
      </div>

      <div>
        <div className='bg-lightblue pt-10 pb-8'>
          <p className='max-w-[660px] text-[48px] leading-[58px] font-medium font-orator-std text-center text-black mx-auto'>
            Exchange Tokens <br />
            Create Liquidity Pairs <br />
            Farm Tokens
          </p>
        </div>
      </div>

      <TokenomicsTable />

      <div className='bg-lightred py-12'>
        <p className='text-[48px] leading-[58px] text-center text-black font-orator-std max-w-[865px] mx-auto'>
          Follow our socials for updates on the coolest decentralized swappery
          in town!
        </p>
      </div>
    </div>
  );
}
