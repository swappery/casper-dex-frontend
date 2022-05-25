import SearchInput from "./SearchInput";

interface TokenModalProps {
  modalId: string;
}

export default function TokenModal({ modalId }: TokenModalProps) {
  return (
    <>
      <input type='checkbox' id={modalId} className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box bg-success rounded-none p-0 relative'>
          <div className='flex justify-between items-center text-neutral p-6 border-b border-neutral'>
            <p className='font-orator-std text-[24px]'>Select a Token</p>
            <label
              htmlFor={modalId}
              className='cursor-pointer hover:opacity-70'>
              ✕
            </label>
          </div>

          <div className='py-7'>
            <SearchInput />
          </div>
        </div>
      </div>
    </>
  );
}
