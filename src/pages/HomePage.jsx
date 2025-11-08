import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
// Impor ikon-ikon baru
import {
  MapPinIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  SpinnerIcon,
} from "../components/Icons";

const masterPulauList = [
  "pulau-wanci",
  "pulau-binongko",
  "pulau-kaledupa",
  "pulau-tomia",
  "pulau-bau-bau",
  "pulau-pasarwajo",
];
// ----------------------------

const HeroSection = () => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 sm:p-12 rounded-2xl shadow-xl mb-12">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
      Selamat Datang di PIJAR
    </h2>
    <p className="text-lg sm:text-xl text-blue-100">
      Papan Informasi Jadwal Kapal Reguler Wakatobi.
    </p>
    <p className="text-blue-200 mt-2">
      Pilih pulau atau pelabuhan di bawah untuk melihat jadwal keberangkatan
      kapal.
    </p>
  </div>
);

// --- Komponen Halaman Utama ---
function HomePage() {
  const [pulauData, setPulauData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const promises = masterPulauList.map((idPulau) =>
          fetch(`${import.meta.env.BASE_URL}data/${idPulau}.json`).then(
            (res) => {
              if (!res.ok) {
                throw new Error(`Gagal memuat /data/${idPulau}.json`);
              }
              return res.json();
            }
          )
        );

        const allData = await Promise.all(promises);
        setPulauData(allData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Tampilan Loading (Dipercantik) ---
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl shadow-md min-h-[300px]">
          <SpinnerIcon />
          <p className="text-lg font-semibold text-gray-600 mt-4">
            Memuat data pulau...
          </p>
        </div>
      </Layout>
    );
  }

  // --- Tampilan Error (Dipercantik) ---
  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon />
            <div>
              <h3 className="text-xl font-bold text-red-800">
                Terjadi Kesalahan
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
              <p className="text-red-600 mt-2 text-sm">
                Pastikan file JSON ada di `public/data/` dan nama filenya benar
                di `masterPulauList`.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --- Tampilan Sukses (Desain Baru) ---
  return (
    <Layout>
      {/* 1. Tambahkan Hero Section di sini */}
      <HeroSection />

      {/* 2. Daftar Pulau dengan Kartu Baru */}
      <div className="space-y-10">
        {pulauData.map((pulau) => (
          <div
            key={pulau.id_pulau}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            {/* Judul Kartu Pulau */}
            <div className="flex items-center space-x-3 mb-6">
              <MapPinIcon />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {pulau.nama_pulau}
              </h3>
            </div>

            {/* Grid untuk Pelabuhan (dibuat lebih cantik) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pulau.pelabuhan.map((pelabuhan) => (
                <Link
                  to={`/pelabuhan/${pelabuhan.id_pelabuhan}`}
                  key={pelabuhan.id_pelabuhan}
                  className="block bg-white p-5 rounded-xl shadow-sm border border-gray-200 
                             hover:shadow-lg hover:border-blue-500 hover:scale-[1.03] 
                             transition-all duration-300 ease-in-out"
                >
                  <p className="font-semibold text-lg text-gray-900">
                    {pelabuhan.nama_pelabuhan}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pelabuhan.jadwal.length} jadwal keberangkatan
                  </p>
                </Link>
              ))}
            </div>

            {/* Tombol "Lihat Semua" (dibuat lebih cantik) */}
            <div className="mt-6">
              <Link
                to={`/pulau/${pulau.id_pulau}`}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white 
                           font-bold py-2 px-5 rounded-lg transition duration-300 
                           shadow-md hover:shadow-lg"
              >
                Lihat Semua Jadwal di Pulau Ini
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default HomePage;
