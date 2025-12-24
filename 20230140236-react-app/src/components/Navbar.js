import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, MapPin, FileText, User } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi halaman aktif
  const [user, setUser] = useState(null);

  // Helper: Decode JWT Token sederhana
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper untuk menentukan class menu aktif
  const getLinkClass = (path) => {
    const baseClass = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClass = "bg-white/20 text-white shadow-sm";
    const inactiveClass = "text-white/80 hover:bg-white/10 hover:text-white";

    return location.pathname === path 
      ? `${baseClass} ${activeClass}` 
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          
          {/* Bagian Kiri: Logo & Menu Utama */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer text-white font-bold text-xl tracking-wide"
              onClick={() => navigate('/dashboard')}
            >
              <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              SIM-Presensi
            </div>

            {/* Menu Navigasi Desktop */}
            <div className="hidden md:flex space-x-2">
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              
              <Link to="/presensi" className={getLinkClass('/presensi')}>
                <MapPin className="w-4 h-4 mr-2" />
                Presensi
              </Link>

              {/* Tampilkan menu Laporan HANYA jika role adalah admin */}
              {user?.role === 'admin' && (
                <Link to="/laporan" className={getLinkClass('/laporan')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Laporan
                </Link>
              )}
            </div>
          </div>

          {/* Bagian Kanan: User Profile & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex flex-col items-end text-white mr-2">
                <span className="text-sm font-semibold">{user.nama}</span>
                <span className="text-xs opacity-80 capitalize bg-white/20 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center text-white bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile (Opsional: Tampil hanya di layar kecil) */}
      <div className="md:hidden flex justify-around bg-blue-700/30 py-2 border-t border-white/10">
        <Link to="/dashboard" className="text-white p-2">
          <LayoutDashboard className="w-6 h-6" />
        </Link>
        <Link to="/presensi" className="text-white p-2">
          <MapPin className="w-6 h-6" />
        </Link>
        {/* Mobile: Tampilkan menu Laporan HANYA jika role adalah admin */}
        {user?.role === 'admin' && (
          <Link to="/laporan" className="text-white p-2">
            <FileText className="w-6 h-6" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;