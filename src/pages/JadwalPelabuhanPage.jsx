import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import JadwalItem from "../components/JadwalItem";

// Daftar ID pelabuhan dan file JSON pulau asalnya.
// Ini penting agar halaman tahu harus mengambil file JSON yang mana.
const pelabuhanMap = {
  "PLB-PATINGGU": "pulau-wanci",
  "PLB-RAKYAT-WANCI": "pulau-wanci",
  "PLB-RUKUWA": "pulau-binongko",
  "PLB-BURANGA": "pulau-kaledupa",
  "PLB-FERI-TOMIA": "pulau-tomia",
  "PLB-JEMBATAN-BATU": "bau-bau",
  "PLB-PASARWAJO": "pasarwajo", // Tambahkan pelabuhan lain di sini
};

const getTodayDateString = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`; // Format: DD/MM/YYYY
};
function JadwalPelabuhanPage() {
  const { pelabuhanId } = useParams();

  // State untuk menyimpan data yang di-fetch
  const [pelabuhan, setPelabuhan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedKapal, setSelectedKapal] = useState("");
  const [selectedHari, setSelectedHari] = useState("");
  const [selectedRute, setSelectedRute] = useState("");

  useEffect(() => {
    // 1. Cari tahu file JSON mana yang harus diambil
    const idPulau = pelabuhanMap[pelabuhanId.toUpperCase()]; // Pastikan konsisten (misal: PLB-PATINGGU)

    if (!idPulau) {
      setError("Pelabuhan tidak terdaftar di pelabuhanMap.");
      setLoading(false);
      return;
    }

    // 2. Fungsi untuk mengambil data JSON
    const fetchJadwal = async () => {
      try {
        setLoading(true);
        // Penting: File di folder 'public' bisa di-fetch langsung dari root URL
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/${idPulau}.json`
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat file JSON: ${response.statusText}`);
        }

        const dataPulau = await response.json();

        // 3. Cari data pelabuhan spesifik dari file JSON pulau
        const pelabuhanDitemukan = dataPulau.pelabuhan.find(
          (p) => p.id_pelabuhan.toUpperCase() === pelabuhanId.toUpperCase()
        );

        if (pelabuhanDitemukan) {
          setPelabuhan(pelabuhanDitemukan);
        } else {
          throw new Error("Data pelabuhan tidak ditemukan di dalam file JSON.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [pelabuhanId]); // Efek ini akan berjalan lagi jika pelabuhanId berubah

  // --- LOGIKA BARU: BUAT OPSI FILTER & JADWAL YANG DIFILTER ---

  // 1. Buat daftar opsi (kapal, hari, tanggal) secara dinamis dari data
  const filterOptions = useMemo(() => {
    if (!pelabuhan) return { kapal: [], hari: [], tanggal: [] };

    const kapalSet = new Set();
    const hariSet = new Set();
    const tanggalSet = new Set();
    const ruteSet = new Set();

    pelabuhan.jadwal.forEach((item) => {
      kapalSet.add(item.nama_kapal);
      hariSet.add(item.hari);
      tanggalSet.add(item.tanggal);
      ruteSet.add(item.rute);
    });

    return {
      kapal: [...kapalSet].sort(),
      hari: [...hariSet].sort(), // Urutkan hari (opsional)
      tanggal: [...tanggalSet],
      rute: [...ruteSet].sort(),
    };
  }, [pelabuhan]); // Hanya hitung ulang jika data pelabuhan berubah

  // 2. Terapkan filter ke jadwal
  const filteredJadwal = useMemo(() => {
    if (!pelabuhan) return [];

    return pelabuhan.jadwal.filter((item) => {
      // Cek setiap filter. Jika filter "" (kosong), anggap lolos (match)
      const matchDate = selectedDate === "" || item.tanggal === selectedDate;
      const matchKapal =
        selectedKapal === "" || item.nama_kapal === selectedKapal;
      const matchHari = selectedHari === "" || item.hari === selectedHari;
      const matchRute = selectedRute === "" || item.rute === selectedRute;

      // Hanya tampilkan jika lolos semua filter
      return matchDate && matchKapal && matchHari && matchRute;
    });
  }, [pelabuhan, selectedDate, selectedKapal, selectedHari, selectedRute]); // Hitung ulang jika filter atau data berubah

  if (loading) {
    return (
      <Layout>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Memuat Jadwal...
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
          <p className="text-gray-500">Silakan tunggu...</p>
        </div>
      </Layout>
    );
  }

  // --- Tampilan saat Error ---
  if (error || !pelabuhan) {
    return (
      <Layout>
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mt-2">
            {error || "Data pelabuhan tidak ditemukan."}
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
        Jadwal dari{" "}
        <span className="text-blue-600">{pelabuhan.nama_pelabuhan}</span>
      </h2>

      {/* --- UI FILTER BARU --- */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Filter Jadwal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter Tanggal */}
          <div>
            <label
              htmlFor="filter-tanggal"
              className="block text-sm font-medium text-gray-600"
            >
              Tanggal
            </label>
            <select
              id="filter-tanggal"
              value={selectedDate} // Defaultnya adalah tanggal hari ini
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Tanggal</option>
              {filterOptions.tanggal.map((t) => (
                <option key={t} value={t}>
                  {t}
                  {t === getTodayDateString() ? " (Hari Ini)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kapal */}
          <div>
            <label
              htmlFor="filter-kapal"
              className="block text-sm font-medium text-gray-600"
            >
              Nama Kapal
            </label>
            <select
              id="filter-kapal"
              value={selectedKapal}
              onChange={(e) => setSelectedKapal(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Kapal</option>
              {filterOptions.kapal.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Hari */}
          <div>
            <label
              htmlFor="filter-hari"
              className="block text-sm font-medium text-gray-600"
            >
              Hari
            </label>
            <select
              id="filter-hari"
              value={selectedHari}
              onChange={(e) => setSelectedHari(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Hari</option>
              {filterOptions.hari.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-rute"
              className="block text-sm font-medium text-gray-600"
            >
              Rute
            </label>
            <select
              id="filter-rute"
              value={selectedRute}
              onChange={(e) => setSelectedRute(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Rute</option>
              {filterOptions.rute.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- DAFTAR JADWAL (Sekarang menggunakan filteredJadwal) --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <ul className="space-y-4">
          {filteredJadwal.length > 0 ? (
            // Gunakan filteredJadwal di sini, bukan pelabuhan.jadwal
            filteredJadwal.map((item) => (
              <JadwalItem key={item.id_jadwal} jadwal={item} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {/* Pesan yang berbeda jika tidak ada jadwal vs tidak ada hasil filter */}
              {pelabuhan.jadwal.length === 0
                ? "Belum ada jadwal keberangkatan."
                : "Tidak ada jadwal yang sesuai dengan filter Anda."}
            </p>
          )}
        </ul>
      </div>
    </Layout>
  );
}

export default JadwalPelabuhanPage;
