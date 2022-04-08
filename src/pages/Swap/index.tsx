import React from "react";

export default function Swap() {
  return (
    <div className="container mx-auto mt-10">
      <div className="bg-transparent w-96 mx-auto rounded-2xl border border-slate-300 shadow-lg">
        <div className="p-5 text-center">
          <span className="text-2xl text-white">Swap</span>
          <div>trade tokens in an instant</div>
        </div>
        <hr />
        <div className="p-3">
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
        </div>
      </div>
    </div>
  );
}
