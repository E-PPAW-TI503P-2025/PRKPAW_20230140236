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
      // PERBAIKAN URL ENDPOINT:
      // Disesuaikan dengan routes/reports.js (/daily) dan server.js (/api/reports)
      const response = await axios.get("http://localhost:3001/api/reports/daily", {
        params: { nama: query || "" }, // Sesuaikan query param (biasanya filter by 'nama')
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Handle response data
      // Backend biasanya mengembalikan JSON langsung atau dibungkus properti .data
      setReports(response.data.data || response.data); 
      setError(null);
    } catch (err) {
      setReports([]);
      // Tampilkan pesan error spesifik jika ada (misal: 403 Forbidden untuk non-admin)
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data laporan"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Navbar di atas */}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Header Title */}
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Sedang memuat data...
                    </td>
                  </tr>
                ) : reports.length > 0 ? (
                  reports.map((presensi) => (
                    <tr key={presensi.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {presensi.user ? presensi.user.nama : "User Tidak Dikenal"}
                        </div>
                        <div className="text-xs text-gray-500">{presensi.user?.email}</div>
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
                             <MapPin className="w-4 h-4" /> Lihat Peta
                           </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Tidak ada lokasi</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                      Tidak ada data presensi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;