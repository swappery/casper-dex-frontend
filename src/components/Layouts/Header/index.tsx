import React from "react";

export default function index() {
  return (
    <header className="shadow-xl bg-transparent bg-opacity-20 ">
      <nav className="flex items-center justify-between p-3 container mx-auto">
        <div className="flex items-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
          Swappery
          <span className=" text-indigo-400">DEX</span>
        </div>

        <div className="flex items-center">
          <div className="mr-5 lg:mr-0">
            <button className="py-2 px-6 text-white text-lg font-BwGradualDEMO inline-flex items-center">
              <span className="ml-2">connect wallet</span>
            </button>
          </div>
          <div>
            <button className="py-2 px-6 text-white text-lg font-BwGradualDEMO">
              Home
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
