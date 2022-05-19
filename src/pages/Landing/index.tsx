import { Link } from "react-router-dom";
import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import { shortenAddress } from "../../utils/stringUtils";
// import useTheme, { Themes } from "../../hooks/useTheme";

export default function Landing() {
  const { activate } = useCasperWeb3Provider();
  const { isConnected, activeAddress } = useNetworkStatus();

  return (
    <div className='bg-accent'>
      <div className='relative'>
        <div className='max-w-[600px] py-[100px] text-neutral'>
          <p className='font-orator-std text-[70px] leading-[84px] text-center'>
            TIME TO GET SWAPPY!
          </p>
          <div className='max-w-[450px] mx-auto'>
            <p className='font-gotham text-[20px] mt-7 mb-5'>
              Swap, trade, and earn crypto on the coolest decentralized swappery
              in town.
            </p>
            <div className='flex gap-4 font-orator-std'>
              <button
                className='text-black text-[18px] rounded-2xl bg-lightblue py-0.5 px-3'
                onClick={() => activate()}>
                {isConnected ? shortenAddress(activeAddress) : "Connect Wallet"}
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
  );
}
