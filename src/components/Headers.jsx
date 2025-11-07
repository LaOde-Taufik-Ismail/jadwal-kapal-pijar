import React from "react";
import { Link } from "react-router-dom";
import { AnchorIcon } from "./Icons";

const Header = () => (
  <header className="bg-blue-600 text-white shadow-md">
    <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <div className="bg-blue-700 p-2 rounded-full">
          <AnchorIcon />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          PIJAR ( PAPAN INFORMASI JADWAL KAPAL REGULER)
        </h1>
      </Link>
    </div>
  </header>
);

export default Header;
