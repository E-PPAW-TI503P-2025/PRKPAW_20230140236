import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react"; 
import Navbar from './Navbar'; 

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- [BARU] State untuk menangani Modal Gambar (Pop-up) ---
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  const fetchReports = async (query) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Pastikan endpoint ini mengembalikan data 'buktiFoto' juga
      const response = await axios.get("http://localhost:3001/api/reports/daily", { // Saya ubah ke endpoint presensi agar konsisten dengan data sebelumnya, sesuaikan jika pakai api/reports
        params: { nama: query || "" }, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setReports(response.data.data || response.data); 
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data laporan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- [BARU] Fungsi Helper: Mengubah Path Database ke URL Gambar ---
  const getImageUrl = (path) => {
    if (!path) return null;
    // 1. Ubah backslash (\) format Windows jadi slash (/) biasa
    const cleanPath = path.replace(/\\/g, "/");
    // 2. Gabungkan dengan URL server backend (Port 3001)
    return `http://localhost:3001/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6"> {/* Saya perlebar dikit jadi max-w-7xl biar muat fotonya */}
        
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Laporan Presensi Harian
          </h1>
          <p className="text-gray-500 mt-1">Rekap data kehadiran mahasiswa (Admin View)</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="Cari berdasarkan nama mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              {isLoading ? "Memuat..." : "Cari"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
            <p className="font-medium">Error / Akses Ditolak</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Table Data */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Keluar</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
                  {/* --- [BARU] Header Kolom Bukti Foto --- */}
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti Foto</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Sedang memuat data...
                    </td>
                  </tr>
                ) : reports.length > 0 ? (
                  reports.map((presensi) => (
                    <tr key={presensi.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {presensi.User ? presensi.User.nama : "User..."}
                        </div>
                        <div className="text-xs text-gray-500">{presensi.User?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(presensi.checkIn).toLocaleDateString("id-ID", {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {new Date(presensi.checkIn).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {presensi.checkOut ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                             {new Date(presensi.checkOut).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">-- : --</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {presensi.latitude && presensi.longitude ? (
                           <a 
                             href={`https://www.google.com/maps?q=${presensi.latitude},${presensi.longitude}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-900 flex items-center justify-center gap-1"
                           >
                             <MapPin className="w-4 h-4" /> Peta
                           </a>
                        ) : (
                          <span className="text-gray-400 text-xs">No Loc</span>
                        )}
                      </td>
                      
                      {/* --- [BARU] Kolom Thumbnail Foto --- */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {presensi.buktiFoto ? (
                          <div className="relative group w-12 h-12 mx-auto cursor-pointer" onClick={() => setSelectedImage(getImageUrl(presensi.buktiFoto))}>
                            <img 
                              src={getImageUrl(presensi.buktiFoto)} 
                              alt="Bukti"
                              className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-200 group-hover:opacity-75 transition-all"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">Zoom</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Tidak ada foto</span>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">
                      Tidak ada data presensi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- [BARU] MODAL POPUP (Overlay) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)} // Tutup jika klik background gelap
        >
          <div className="relative bg-white p-2 rounded-xl shadow-2xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center px-2 py-1 mb-2 border-b">
                <h3 className="font-semibold text-gray-700">Bukti Foto Presensi</h3>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-red-500 font-bold text-xl px-2"
                >
                  &times;
                </button>
            </div>
            
            {/* Gambar Full Size */}
            <div className="flex-grow overflow-auto flex items-center justify-center bg-gray-100 rounded-lg">
                <img 
                src={selectedImage} 
                alt="Bukti Full" 
                className="max-w-full max-h-[75vh] object-contain"
                />
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-2">
              Klik area gelap untuk menutup
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default ReportPage;