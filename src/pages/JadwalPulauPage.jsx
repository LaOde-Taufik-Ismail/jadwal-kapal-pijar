import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import JadwalItem from "../components/JadwalItem";

function JadwalPulauPage() {
  const { pulauId } = useParams(); // misal: "pulau-wanci"

  // State untuk menyimpan data pulau yang di-fetch
  const [pulau, setPulau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mengambil data JSON pulau
    const fetchPulauData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil file JSON berdasarkan pulauId dari URL
        // MENJADI SEPERTI INI
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/${pulauId}.json`
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat file JSON: ${response.statusText}`);
        }

        const dataPulau = await response.json();
        setPulau(dataPulau); // Simpan seluruh data pulau ke state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPulauData();
  }, [pulauId]); // Efek ini akan berjalan lagi jika pulauId di URL berubah

  // --- Tampilan saat Loading ---
  if (loading) {
    return (
      <Layout>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Memuat Jadwal...
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
          <p className="text-gray-500">Mengambil data untuk {pulauId}...</p>
        </div>
      </Layout>
    );
  }

  // --- Tampilan saat Error ---
  if (error || !pulau) {
    return (
      <Layout>
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mt-2">
            {error || "Data pulau tidak ditemukan."}
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </Layout>
    );
  }

  // --- Tampilan saat Sukses ---
  return (
    <Layout>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Semua Jadwal di{" "}
        <span className="text-blue-600">{pulau.nama_pulau}</span>
      </h2>

      {/* Loop untuk setiap pelabuhan di dalam data pulau */}
      <div className="space-y-8">
        {pulau.pelabuhan.map((pelabuhan) => (
          <div
            key={pelabuhan.id_pelabuhan}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {pelabuhan.nama_pelabuhan}
            </h3>

            <ul className="space-y-4">
              {pelabuhan.jadwal.length > 0 ? (
                // Loop untuk setiap jadwal di dalam pelabuhan
                pelabuhan.jadwal.map((item) => (
                  <JadwalItem key={item.id_jadwal} jadwal={item} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Belum ada jadwal keberangkatan.
                </p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default JadwalPulauPage;
