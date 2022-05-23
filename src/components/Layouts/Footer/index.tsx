import telegram from "../../../assets/images/telegram.svg";
import twitter from "../../../assets/images/twitter.svg";

export default function Footer() {
  return (
    <footer className='grid grid-cols-12 font-gotham text-lightyellow bg-black py-4'>
      <div className='col-start-2 col-end-5 text-[15px]'>
        © 2021 TheSwappery
      </div>
      <div className='col-start-5 col-end-9 md:flex md:justify-around text-[15px]'>
        <p>Documentation</p>
        <p>Audit</p>
      </div>
      <div className='col-start-9 col-end-12 flex justify-end items-center gap-8'>
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
