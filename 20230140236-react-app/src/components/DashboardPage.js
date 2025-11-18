import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Helper Function untuk membaca data Token (tanpa install library tambahan) ---
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
      navigate('/login'); // Redirect jika tidak ada token
    } else {
      const decodedUser = parseJwt(token);
      // Fallback jika token tidak valid/kosong, anggap mahasiswa (untuk testing)
      if (!decodedUser) {
         navigate('/login');
      } else {
         setUser(decodedUser);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Tampilkan Loading jika data user belum siap
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-purple-600 font-bold">Loading Dashboard...</div>;
  }

  // --- KONTEN KHUSUS MAHASISWA ---
  const StudentContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Card 1 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">📚</div>
          <span className="text-xs font-bold text-purple-500 bg-purple-100 px-2 py-1 rounded">AKADEMIK</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">KRS Online</h3>
        <p className="text-gray-500 text-sm">Isi dan revisi Rencana Studi semester ini.</p>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">📅</div>
          <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded">JADWAL</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Jadwal Kuliah</h3>
        <p className="text-gray-500 text-sm">Lihat jadwal kelas dan praktikum mingguan.</p>
      </div>

      {/* Card 3 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">🎓</div>
          <span className="text-xs font-bold text-green-500 bg-green-100 px-2 py-1 rounded">HASIL STUDI</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Transkrip Nilai</h3>
        <p className="text-gray-500 text-sm">Pantau IPK dan riwayat nilai semester.</p>
      </div>
    </div>
  );

  // --- KONTEN KHUSUS ADMIN ---
  const AdminContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Card Admin 1 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500 cursor-pointer">
        <div className="text-4xl mb-4 text-red-500">👥</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Data Pengguna</h3>
        <p className="text-gray-500 text-sm">Kelola data Mahasiswa dan Dosen.</p>
        <button className="mt-4 text-red-600 font-semibold text-sm hover:underline">Kelola &rarr;</button>
      </div>

      {/* Card Admin 2 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500 cursor-pointer">
        <div className="text-4xl mb-4 text-orange-500">📝</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Validasi KRS</h3>
        <p className="text-gray-500 text-sm">Menyetujui atau menolak pengajuan KRS.</p>
        <button className="mt-4 text-orange-600 font-semibold text-sm hover:underline">Lihat Pengajuan &rarr;</button>
      </div>

      {/* Card Admin 3 */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-gray-700 cursor-pointer">
        <div className="text-4xl mb-4 text-gray-700">⚙️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Pengaturan Sistem</h3>
        <p className="text-gray-500 text-sm">Konfigurasi semester dan mata kuliah.</p>
        <button className="mt-4 text-gray-700 font-semibold text-sm hover:underline">Buka Pengaturan &rarr;</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. NAVBAR: Menggunakan Gradient yang sama dengan Login/Register */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            {/* Icon Kampus Sederhana */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <span className="text-xl font-bold tracking-wide">Sistem Akademik</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block text-white">
              <p className="text-sm font-semibold">{user.nama}</p>
              <p className="text-xs opacity-80 uppercase tracking-wider">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT */}
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
          {/* Statistik Singkat (Placeholder) */}
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

        {/* 3. CONDITIONAL RENDERING: Tampilkan konten berdasarkan Role */}
        <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-700 border-b pb-2">Menu Utama</h2>
        </div>

        {user.role === 'admin' ? <AdminContent /> : <StudentContent />}

      </div>
    </div>
  );
}

export default DashboardPage;