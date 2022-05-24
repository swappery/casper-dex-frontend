import useTheme, { Themes } from "../../../hooks/useTheme";

export default function TokenomicsTable() {
  const { theme, setTheme } = useTheme();

  return (
    <table
      className={`w-full tokenomics text-center font-orator-std text-black ${
        theme === Themes.LIGHT ? "" : "dark"
      }`}>
      <tbody>
        <tr>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[5%] xl:w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px] w-[5%] xl:w-[9%]'></td>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
        </tr>
        <tr className='text-[12px] xl:text-[25px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td></td>
          <td></td>
          <td colSpan={3} className='bg-lightblue'>
            Total Tokens
          </td>
          <td colSpan={2} className='bg-lightblue'>
            Vesting
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>SEED ROUND</td>
          <td className='bg-lightred'>2%</td>
          <td colSpan={3} className='bg-lightred'>
            20'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            12 MONTHS
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>PRIVATE SALE</td>
          <td className='bg-lightred'>10%</td>
          <td colSpan={3} className='bg-lightred'>
            100'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            10 MONTHS
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>PUBLIC SALE</td>
          <td className='bg-lightred'>10%</td>
          <td colSpan={3} className='bg-lightred'>
            100'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            8 MONTHS
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>LIQUIDITY</td>
          <td className='bg-lightred'>5%</td>
          <td colSpan={3} className='bg-lightred'>
            50'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            Unlocked
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>ADVISORY</td>
          <td className='bg-lightred'>3%</td>
          <td colSpan={3} className='bg-lightred'>
            30'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            24 Months
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightblue'>FARMING REWARDS</td>
          <td className='bg-lightred'>70%</td>
          <td colSpan={3} className='bg-lightred'>
            700'000'000 SWPR
          </td>
          <td colSpan={2} className='bg-lightred'>
            --
          </td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr className='text-[11px] xl:text-[20px]'>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td className='bg-lightgreen'>TOTAL</td>
          <td className='bg-lightgreen'>100%</td>
          <td colSpan={3} className='bg-lightgreen'>
            1'000'000'000 SWPR
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
        <tr>
          <td className='hidden xl:table-cell h-[40px] xl:h-[70px] w-[9%]'></td>
          <td className='h-[40px] xl:h-[70px]'></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td className='hidden xl:table-cell w-[9%]'></td>
        </tr>
      </tbody>
    </table>
  );
}
