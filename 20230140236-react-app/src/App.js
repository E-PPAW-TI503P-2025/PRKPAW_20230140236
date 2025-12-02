import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import AttendancePage from './components/AttendancePage'; // File yang direname dari PresensiPage
import ReportPage from './components/ReportPage'; // Pastikan nama file sesuai

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Redirect root (/) otomatis ke halaman Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Route Halaman Auth (Tanpa Navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 3. Route Halaman Utama (Navbar sudah ada di dalam komponen masing-masing) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* PENTING: Path ini harus sama dengan yang ditulis di navigate() pada DashboardPage.js */}
        <Route path="/presensi" element={<AttendancePage />} />
        <Route path="/laporan" element={<ReportPage />} />
        
        {/* 4. Fallback jika halaman tidak ditemukan (404) */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800">404</h1>
            <p className="text-gray-600 mt-2">Halaman tidak ditemukan</p>
            <a href="/dashboard" className="mt-4 text-blue-600 hover:underline">Kembali ke Dashboard</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;