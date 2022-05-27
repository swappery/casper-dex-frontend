import { ReactNode } from "react";
import casperToken from "../../../assets/images/tokens/0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4.svg";
import swprToken from "../../../assets/images/tokens/0x6FA23529476a1337EB5da8238b778e7122d79666.svg";

type LPTokenProps = {
  children: ReactNode;
};

const LPTokenDetail = ({ children }: LPTokenProps) => {
  return (
    <div className='font-orator-std w-full py-4 md:py-7 px-2 md:px-14 border border-neutral mt-8 mb-3 md:mt-14 md:mb-8'>
      <p className='text-[18px] text-neutral mb-5'>lp tokens in your wallet</p>
      <div className='rounded-3xl border border-neutral px-4 md:px-9 flex justify-between items-center text-[15px] text-neutral'>
        <div className='flex items-center'>
          <div className='flex mr-2 md:mr-4'>
            <img
              src={casperToken}
              alt='Casper Token'
              className='w-[30px] h-[30px] md:w-[37px] md:h-[37px]'
            />
            <div className='w-[30px] h-[30px] md:w-[37px] md:h-[37px] border border-neutral rounded-[50%]'></div>
            <img
              src={swprToken}
              alt='SWPR Token'
              className='w-[30px] h-[30px] md:w-[37px] md:h-[37px]'
            />
          </div>
          <p>CSPR-SWPR LP</p>
        </div>
        <p>22070</p>
      </div>
      <div className='text-[15px] text-neutral mt-6'>
        <p className='flex justify-between'>
          <span>share of pool</span>
          <span>95.3519%</span>
        </p>
        <p className='flex justify-between my-1'>
          <span>pooled BNB</span>
          <span>437719</span>
        </p>
        <p className='flex justify-between'>
          <span>pooled SWPR</span>
          <span>114.525</span>
        </p>
      </div>

      {children}
    </div>
  );
};

export default LPTokenDetail;
