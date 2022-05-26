import { useState, useEffect, ChangeEvent } from "react";
import SWPR from "../../../assets/images/tokens/0x6FA23529476a1337EB5da8238b778e7122d79666.svg";
import USDT from "../../../assets/images/tokens/0xf063b26bBaa7B71B65Ddd954cB0b289bBb7AA95b.png";
import WCSPR from "../../../assets/images/tokens/0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4.png";
import CSPD from "../../../assets/images/tokens/0xef9481115ff33e94d3e28a52d3a8f642bf3521e5.png";

interface TokenItem {
  tokenAddress: string;
  name: string;
  description: string;
}

const tokenLists: TokenItem[] = [
  {
    tokenAddress: "0xef9481115ff33e94d3e28a52d3a8f642bf3521e5",
    name: "CSPD",
    description: "Casperpad Token",
  },
  {
    tokenAddress: "0x6FA23529476a1337EB5da8238b778e7122d79666",
    name: "SWPR",
    description: "Swappery Token",
  },
  {
    tokenAddress: "0xf063b26bBaa7B71B65Ddd954cB0b289bBb7AA95b",
    name: "USDT",
    description: "Tether USD",
  },
  {
    tokenAddress: "0x80dB3a8014872a1E6C3667926ABD7d3cE61eD0C4",
    name: "WCSPR",
    description: "Casper Wrapped Native",
  },
];
const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TokenItem[] | undefined>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const results = tokenLists.filter((token) =>
      (token.name + token.description + token.tokenAddress)
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
            key={item.name}
            className='py-1 px-6 flex items-center gap-1 hover:bg-accent cursor-pointer'>
            <img src={SWPR} className='w-9 h-9' alt='Token' />
            <div className='font-orator-std'>
              <p className='text-[18px] text-neutral'>{item.name}</p>
              <p className='text-[14px]'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchInput;
