import React from "react";

export default function index() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-around px-2 py-4 w-full bg-transparent text-white backdrop-opacity-40  backdrop-blur-md">
      <div className="font-BwGradualDEMO">
        Copyright © 2022. All Rights Reserved by Un!moon
      </div>
      <p className="font-BwGradualDEMO">version 1.0</p>
      <div className="flex flex-row">
        <button
          type="button"
          className="font-BwGradualDEMO inline-flex items-center m-2"
        >
          Privacy Policy
        </button>
        <button
          type="button"
          className="font-BwGradualDEMO inline-flex items-center m-2"
        >
          Impress
        </button>
      </div>
    </footer>
  );
}
