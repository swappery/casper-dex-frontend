import useNetworkStatus from "../../store/useNetworkStatus";
import useCasperWeb3Provider from "../../web3";
import LPTokenDetail from "./components/LPTokenDetail";

export default function Liquidity() {
  const { activate } = useCasperWeb3Provider();
  const { isConnected } = useNetworkStatus();

  return (
    <div className='flex items-center bg-accent relative page-wrapper py-14 px-5 md:px-0'>
      <div className='container mx-auto grid grid-cols-12'>
        <div className='col-span-12 md:col-start-3 md:col-end-11 xl:col-start-4 xl:col-end-10 grid justify-items-center text-center font-orator-std border border-neutral bg-success px-2 md:px-10 pt-14 pb-16 md:pt-4 md:pb-7'>
          <p className='text-[35px] md:text-[43px] leading-[43px] text-neutral'>
            your liquidity
          </p>
          <p className='text-[20px] md:text-[22px] text-neutral mt-3'>
            remove liquidity to receive tokens back
          </p>

          {isConnected ? (
            <>
              <LPTokenDetail>
                <div className='font-orator-std grid gap-4 text-black mt-7'>
                  <button className='hover:opacity-80 p-[7px] text-[18px] leading-[22px] bg-lightgreen border border-black rounded-3xl'>
                    Remove
                  </button>
                  <button className='hover:opacity-80 p-[9px] text-[15px] leading-[18px] bg-lightgreen border border-black rounded-3xl'>
                    + ADD LIQUIDITY INSTEAD
                  </button>
                </div>
              </LPTokenDetail>

              <div className='grid justify-items-center w-full'>
                <p className='w-full bg-lightred px-2 py-2 text-[18px] leading-[24px] md:leading-[30px] text-black border border-black mt-4 md:mt-6'>
                  No Liquidity Found! Don’t see a Pool You Joined?
                </p>
                <div className='border border-neutral rounded-[50%] w-9 h-9'></div>
                <button className='hover:opacity-80 w-full text-black text-[18px] md:text-[22px] leading-[34px] rounded-3xl bg-lightgreen border border-black py-1.5 px-2 md:px-5 mb-4 md:mb-6'>
                  Find Other LP Tokens
                </button>
              </div>
            </>
          ) : (
            <button
              className='hover:opacity-80 mt-20 mb-4 md:my-16 text-black text-[14px] md:text-[15px] leading-[34px] rounded-3xl bg-lightgreen border border-black py-1.5 px-2 md:px-5'
              onClick={() => activate()}>
              CONNECT WALLET TO VIEW LIQUIDITY
            </button>
          )}
          <button className='hover:opacity-80 md:w-full text-black text-[18px] leading-[34px] border border-black rounded-xl md:rounded-3xl bg-lightgreen py-2 md:py-1.5 px-5'>
            + ADD LIQUIDITY
          </button>
        </div>
      </div>
    </div>
  );
}
