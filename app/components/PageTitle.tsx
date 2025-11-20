import { TbCoinBitcoin } from 'react-icons/tb';

export const PageTitle = () => {
  return (
    <>
      {/* Desktop Title */}
      <div className="max-[1050px]:hidden text-[80px] uppercase mt-[100px]" role="heading" aria-level={1}>
        <h1>latest news</h1>
        <div className="flex items-center space-x-6 mt-[-28px]">
          <h1 className="font-['Albra']">from</h1>
          <hr className="text-white/60 w-full max-w-[193px]" aria-hidden="true" />
          <div className="relative">
            <h1>the world</h1>
            <TbCoinBitcoin 
              className="text-4xl absolute right-[-30px] top-0 rotate-15" 
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Mobile Title */}
      <h1 className="max-[1050px]:block hidden text-[40px]/12 uppercase mt-[58px] font-['Helvetica_Now_Display'] line">
        latest news from the world of finance
      </h1>
    </>
  );
};
