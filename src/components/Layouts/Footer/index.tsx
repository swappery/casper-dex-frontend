import telegram from "../../../assets/images/telegram.svg";
import twitter from "../../../assets/images/twitter.svg";

export default function Footer() {
  return (
    <footer className='grid grid-cols-12 font-gotham text-lightyellow bg-black py-6 lg:py-4 border-t border-neutral'>
      <div className='col-span-12 lg:col-start-2 lg:col-end-5 text-[12px] lg:text-[15px] order-last lg:order-first text-center lg:text-left'>
        © 2021 TheSwappery
      </div>
      <div className='grid col-span-12 justify-center text-center lg:text-left lg:col-start-5 lg:col-end-9 lg:flex lg:justify-around text-[12px] lg:text-[15px] lg:px-8 2xl:px-20'>
        <p className='order-last lg:order-first my-2 lg:my-0'>Documentation</p>
        <p className='order-first lg:order-last'>Audit</p>
      </div>
      <div className='col-span-12 lg:col-start-9 justify-center gap-12 lg:col-end-12 flex lg:justify-end items-center lg:gap-8 order-first lg:order-last mb-4 lg:mb-0'>
        <a href='https://t.me/TheSwapperyAnn' target='_blank'>
          <img src={telegram} className='w-4 h-4' alt='Telegram Icon' />
        </a>
        <a href='https://twitter.com/TheSwappery' target='_blank'>
          <img src={twitter} className='w-4 h-4' alt='Twitter Icon' />
        </a>
      </div>
    </footer>
  );
}
