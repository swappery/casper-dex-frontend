import SearchInput from "./SearchInput";

export default function TokenModal() {
  return (
    <>
      <input type='checkbox' id='currentTokenModal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box bg-success rounded-none p-0 relative'>
          <div className='flex justify-between items-center text-neutral p-6 border-b border-neutral'>
            <p className='font-orator-std text-[24px]'>Select a Token</p>
            <label htmlFor='currentTokenModal' className='cursor-pointer'>
              ✕
            </label>
          </div>

          <div className='p-6'>
            <SearchInput />
          </div>
        </div>
      </div>
    </>
  );
}
