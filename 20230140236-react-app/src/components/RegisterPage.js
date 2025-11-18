import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Perubahan ada di sini: ubah "name" menjadi "nama: name"
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: name, 
        email, 
        password, 
        role
      });
      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Buat Akun Baru</h2>
          <p className="text-gray-500 text-sm">Bergabunglah dengan TI UMY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Masukkan Nama Lengkap Anda"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Masukkan Password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Daftar Sebagai</label>
            <div className="mt-1 relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 cursor-pointer appearance-none"
              >
                <option value="mahasiswa">🎓 Mahasiswa</option>
                <option value="admin">🛡️ Admin / Dosen</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all mt-6"
          >
            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;