import React from "react";
import IconButton from "../../components/Button/IconButton";

export default function Swap() {
  return (
    <div className="container mx-auto mt-10">
      <div className="bg-transparent w-96 mx-auto rounded-2xl border border-slate-300 shadow-lg">
        <div className="p-5 text-center">
          <span className="text-2xl">Swap</span>
          <div>trade tokens in an instant</div>
        </div>
        <hr />
        <div className="relative flex-col justify-between p-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="pb-2">BNB</div>
              <div>
                <input
                  type={"text"}
                  placeholder="Type here"
                  className="input w-full border border-slate-500 focus:outline-none"
                ></input>
              </div>
            </div>
            <div className="flex justify-center">
              <IconButton IconUrl="" />
            </div>
            <div>
              <div className="pb-2">BNB</div>
              <div>
                <input
                  type={"text"}
                  placeholder="Type here"
                  className="input w-full border border-slate-500 focus:outline-none"
                ></input>
              </div>
            </div>
            <div className="flex justify-between px-5 place-items-end">
              <span className="font-bold text-xs">Slippage Tolerance</span>
              <span className="font-bold">1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
