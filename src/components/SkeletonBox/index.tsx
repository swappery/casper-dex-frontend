export default function SkeletonBox() {
  return (
    <div className="border border-neutral bg-success shadow cursor-pointer py-[20px] md:py-[25px] px-[15px] md:px-[35px] my-[15px] lg:my-[30px]">
      <div className="animate-pulse">
        <div className="bg-primary w-full h-10 mb-5 rounded-3xl border border-neutral "></div>
        <div className="flex-1 mb-5">
          <div className="space-y-1">
            <div className="grid grid-cols-8 gap-8">
              <div className="h-4 bg-primary rounded col-span-5"></div>
              <div className="h-4 bg-primary rounded col-span-3"></div>
            </div>
            <div className="grid grid-cols-8 gap-8">
              <div className="h-4 bg-primary rounded col-span-5"></div>
              <div className="h-4 bg-primary rounded col-span-3"></div>
            </div>
            <div className="grid grid-cols-8 gap-8">
              <div className="h-4 bg-primary rounded col-span-5"></div>
              <div className="h-4 bg-primary rounded col-span-3"></div>
            </div>
          </div>
        </div>
        <div className="opacity-75 w-full h-11 mb-5 rounded-3xl bg-lightgreen border border-black px-4 py-[6.5px] text-[14px] md:text-[18px] text-black font-orator-std"></div>
        <div className="opacity-75 w-full h-11 mb-5 rounded-3xl bg-lightgreen border border-black px-4 py-[6.5px] text-[14px] md:text-[18px] text-black font-orator-std"></div>
      </div>
    </div>
  );
}
