import React from "react";
import Header from "./Headers";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      <footer className="text-center p-4 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Info Jadwal Kapal. Dibuat untuk
          kemudahan bersama.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
