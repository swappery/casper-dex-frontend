import { NavLink } from "react-router-dom";
import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import { shortenAddress } from "../../utils/utils";
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
  const { theme } = useTheme();
  const { activate } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();

  return (
    <div className='bg-accent overflow-hidden'>
      <div className='relative'>
        <div className='2xl:container 2xl:mx-auto relative'>
          <img
            src={blueHand}
            className='absolute -top-[80px] -left-[15px] w-[80px] xl:w-[180px] xl:-top-28 xl:left-8 z-10'
            alt='Blue Hand'
          />
          <img
            src={greenHand}
            className='absolute h-[105px] left-[212px] -top-[25px] xl:h-[233px] xl:top-[5px] xl:left-[555px]'
            alt='Green Hand'
          />
          <img
            src={theme === Themes.LIGHT ? pinkHand : pinkHandDark}
            className='absolute h-[175px] -right-[80px] sm:right-0 -bottom-[20px] xl:h-[372px] xl:bottom-12 xl:right-10 z-10'
            alt='Pink Hand'
          />
          <div className='absolute border-t border-b border-black bg-white w-full hidden sm:block sm:h-[27px] sm:top-[48px] left-[251px] xl:h-[58px] xl:top-[167px] xl:left-[648px]'></div>
          <div className='pt-[40px] xl:max-w-[640px] xl:pl-[40px] xl:pt-[150px] xl:pb-[150px] text-neutral'>
            <p className='max-w-[200px] xl:max-w-none ml-[20px] xl:ml-0 text-[30px] leading-[36px] xl:text-[70px] xl:leading-[84px] text-center font-orator-std'>
              TIME TO GET SWAPPY!
            </p>
            <div className='xl:max-w-[450px] mx-auto'>
              <p className='max-w-[240px] lg:max-w-none ml-[30px] lg:ml-0 mt-[10px] font-gotham text-[11px] xl:text-[20px] xl:mt-7 xl:mb-5'>
                Swap, trade, and earn crypto on the coolest decentralized
                swappery in town.
              </p>
              <div className='flex gap-2 lg:gap-4 mt-[30px] xl:mt-0 ml-[25px] xl:ml-0 font-orator-std'>
                {isConnected ? (
                  ""
                ) : (
                  <button
                    className='text-black text-[13px] xl:text-[19px] rounded-2xl bg-lightblue py-0.5 px-3'
                    onClick={() => activate()}>
                    Connect Wallet
                  </button>
                )}

                <NavLink
                  to='/swap'
                  className='text-[13px] xl:text-[19px] rounded-2xl border border-neutral px-3'>
                  TRADE
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='text-center text-neutral pb-[65px] xl:pb-[180px] mt-[40px] xl:mt-0 relative'>
        <p className='font-orator-std  text-[30px] leading-[36px] xl:text-[56px] xl:leading-[68px] max-w-[1030px] mx-auto pb-6'>
          THE FIRST AND ONLY CROSS-CHAIN DEX ON CASPER NETWORK & BSC!
        </p>
        <p className='font-gotham text-[11px] leading-[14px] xl:text-[20px] xl:leading-[24px] max-w-[300px] xl:max-w-[830px] mx-auto'>
          At The Swapperry, we are building a MultiChain Dex, starting with BSC
          and Casper – and then moving to Fantom, Terra, ETH, and others.
        </p>

        <img
          src={theme === Themes.LIGHT ? logo : logoWhite}
          className='animate-slide absolute -bottom-[15px] h-[65px] xl:-bottom-[30px] -right-[100%] xl:h-[155px]'
          alt='Swappery Logo'
        />
      </div>

      <div>
        <div className='bg-lightblue py-[25px] xl:pt-10 xl:pb-8'>
          <p className='text-[18px] leading-[22px] xl:max-w-[660px] xl:text-[48px] xl:leading-[58px] font-medium font-orator-std text-center text-black mx-auto'>
            Exchange Tokens <br />
            Create Liquidity Pairs <br />
            Farm Tokens
          </p>
        </div>
      </div>

      <TokenomicsTable />

      <div className='bg-lightred py-[32px] xl:py-12 px-4'>
        <p className='text-[18px] leading-[22px] xl:text-[48px] xl:leading-[58px] text-center text-black font-orator-std max-w-[865px] mx-auto'>
          Follow our socials for updates on the coolest decentralized swappery
          in town!
        </p>
      </div>
    </div>
  );
}
