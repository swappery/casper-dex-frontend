import { useState, useEffect, ChangeEvent } from "react";
import { supportedTokens, TokenContext } from "../../store/useLiquidityStatus";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TokenContext[] | undefined>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = supportedTokens.filter((token) =>
      (token.symbol + token.name + token.contractHash)
        .toLowerCase()
        .includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <>
      <div className='px-6'>
        <input
          className='font-orator-std focus:outline-none w-full py-[6px] px-3 md:py-2 md:px-5 bg-lightblue rounded-[30px] text-[14px] md:text-[20px] text-black border border-neutral'
          placeholder='Search name or paste address'
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <div className='grid gap-2 mt-6'>
        {searchResults?.map((item) => (
          <div
            key={item.symbol}
            className='py-1 px-6 flex items-center gap-1 hover:bg-accent cursor-pointer'>
            <img src={item.tokenSvg} className='w-9 h-9' alt='Token' />
            <div className='font-orator-std'>
              <p className='text-[18px] text-neutral'>{item.symbol}</p>
              <p className='text-[14px]'>{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchInput;
