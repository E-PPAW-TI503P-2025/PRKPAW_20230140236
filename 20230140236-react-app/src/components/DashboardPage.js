import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // <-- 1. Import Navbar

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedUser = parseJwt(token);
      if (!decodedUser) {
         navigate('/login');
      } else {
         setUser(decodedUser);
      }
    }
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-purple-600 font-bold">Loading Dashboard...</div>;
  }

  // --- KONTEN KHUSUS MAHASISWA ---
  const StudentContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Menu Presensi */}
      <div 
        onClick={() => navigate('/presensi')} 
        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-600 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">📍</div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">HARIAN</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Presensi Online</h3>
        <p className="text-gray-500 text-sm">Check-in lokasi & Check-out harian.</p>
      </div>

      {/* Menu Laporan */}
      <div 
        onClick={() => navigate('/laporan')} 
        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">📊</div>
          <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded">REKAP</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Riwayat Presensi</h3>
        <p className="text-gray-500 text-sm">Lihat log kehadiran Anda.</p>
      </div>

      {/* Menu Akademik Lainnya */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-gray-400 cursor-pointer opacity-70">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-gray-100 rounded-full">🎓</div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">AKADEMIK</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">KRS & Nilai</h3>
        <p className="text-gray-500 text-sm">Fitur segera hadir...</p>
      </div>
    </div>
  );

  // --- KONTEN KHUSUS ADMIN ---
  const AdminContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500 cursor-pointer" onClick={() => navigate('/laporan')}>
        <div className="text-4xl mb-4 text-red-500">👥</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Data Presensi</h3>
        <p className="text-gray-500 text-sm">Pantau kehadiran seluruh mahasiswa.</p>
        <button className="mt-4 text-red-600 font-semibold text-sm hover:underline">Lihat Laporan &rarr;</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500 cursor-pointer">
        <div className="text-4xl mb-4 text-orange-500">📝</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Validasi KRS</h3>
        <p className="text-gray-500 text-sm">Menyetujui atau menolak pengajuan KRS.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 2. Gunakan Komponen Navbar disini */}
      <Navbar />

      <div className="container mx-auto p-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">{user.nama}</span>! 👋
            </h1>
            <p className="text-gray-600">
              Selamat datang di Dashboard <span className="font-bold capitalize">{user.role}</span>.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4 text-center">
             <div className="bg-purple-50 px-4 py-2 rounded-lg">
               <p className="text-2xl font-bold text-purple-600">Aktif</p>
               <p className="text-xs text-gray-500">Status</p>
             </div>
             <div className="bg-blue-50 px-4 py-2 rounded-lg">
               <p className="text-2xl font-bold text-blue-600">2025/1</p>
               <p className="text-xs text-gray-500">Periode</p>
             </div>
          </div>
        </div>

        <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-700 border-b pb-2">Menu Utama</h2>
        </div>

        {user.role === 'admin' ? <AdminContent /> : <StudentContent />}

      </div>
    </div>
  );
}

export default DashboardPage;