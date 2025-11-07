import React from "react";
import { ClockIcon, CalendarIcon } from "./Icons"; // Kita tidak pakai ShipIcon di sini

// Ikon baru untuk Rute
const RouteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    />
  </svg>
);

// Ikon baru untuk Tanggal
const DateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const JadwalItem = ({ jadwal }) => (
  <li className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border-l-4 border-blue-500">
    {/* Bagian Kiri: Info Kapal & Rute */}
    <div className="pl-3 flex-grow">
      <p className="font-bold text-gray-800 text-lg">
        {jadwal.nama_kapal}{" "}
        <span className="font-normal text-gray-500 text-sm">
          (GT {jadwal.gt})
        </span>
      </p>

      <div className="flex items-center mt-2 text-sm text-gray-700">
        <RouteIcon />
        <span className="font-medium">{jadwal.rute}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-sm">
        <div className="flex items-center text-gray-700">
          <CalendarIcon />
          <span>{jadwal.hari}</span>
        </div>
        <div className="flex items-center text-gray-700 mt-1 sm:mt-0">
          <DateIcon />
          <span>{jadwal.tanggal}</span>
        </div>
      </div>
    </div>

    {/* Bagian Kanan: Jam Berangkat */}
    <div className="flex items-center text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-full self-start sm:self-center font-bold">
      <ClockIcon />
      <span>{jadwal.jam_berangkat}</span>
    </div>
  </li>
);

export default JadwalItem;
