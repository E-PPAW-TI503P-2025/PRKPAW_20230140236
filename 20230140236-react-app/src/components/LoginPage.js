import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Tambahan state loading agar UX lebih bagus
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Background Gradient yang sama dengan Register
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-8">
      
      {/* 2. Card Container dengan rounded-2xl dan shadow-2xl */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        {/* 3. Header yang lebih rapi */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-500 text-sm mt-2">Silakan login untuk masuk ke dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            {/* 4. Input Styling yang konsisten (Focus Purple) */}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="Masukkan email Anda"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="********"
            />
          </div>

          {/* 5. Tombol Login dengan warna Purple */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all disabled:bg-purple-300"
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        {/* Pesan Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* 6. Footer Link ke Register */}
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className="text-purple-600 font-bold hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;