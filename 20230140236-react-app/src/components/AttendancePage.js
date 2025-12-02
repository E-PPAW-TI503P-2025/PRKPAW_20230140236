import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Navigation, LogIn, LogOut } from 'lucide-react';
import Navbar from './Navbar';

// 1. Import React Leaflet dan CSS-nya
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 2. Fix untuk Icon Marker Leaflet yang suka hilang di React
// (Ini masalah umum di Leaflet + React, kode ini memperbaikinya)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function AttendancePage() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi mendapatkan lokasi
  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckIn = async () => {
    setMessage(null);
    setError(null);

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi browser Anda.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token'); 

      if (!token) {
        setError("Anda belum login (Token tidak ditemukan).");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message || "Check-In Berhasil");
    } catch (err) {
      console.error(err);
      setError(
        err.response && err.response.data 
          ? err.response.data.message 
          : "Gagal melakukan Check-In"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setMessage(null);
    setError(null);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError("Anda belum login.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message || "Check-Out Berhasil");
    } catch (err) {
      setError(
        err.response && err.response.data 
          ? err.response.data.message 
          : "Gagal melakukan Check-Out"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <Navbar />

      <div className="flex flex-col items-center justify-center p-4 pt-10">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
          
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sistem Presensi</h2>
            <p className="text-gray-500 text-sm mt-1">Silakan konfirmasi kehadiran Anda</p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center">
              <span className="mr-2">✓</span> {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center">
                <span className="mr-2">⚠</span> {error}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi Anda</span>
              {isLoading && !coords && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
            </div>
            
            {coords ? (
              <div className="text-sm font-mono text-gray-700">
                <div>Lat: <span className="font-semibold text-gray-900">{coords.lat.toFixed(6)}</span></div>
                <div>Lng: <span className="font-semibold text-gray-900">{coords.lng.toFixed(6)}</span></div>
              </div>
            ) : (
              <div className="text-sm text-yellow-600 flex items-center">
                <Navigation className="w-4 h-4 mr-2 animate-pulse" />
                <span>Mencari titik lokasi GPS...</span>
              </div>
            )}
          </div>

          {/* 3. Visualisasi Peta menggunakan React Leaflet */}
          {coords && (
            <div className="my-4 border rounded-lg overflow-hidden">
               <MapContainer 
                  center={[coords.lat, coords.lng]} 
                  zoom={15} 
                  style={{ height: '300px', width: '100%' }}
               >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[coords.lat, coords.lng]}>
                    <Popup>Lokasi Presensi Anda</Popup>
                  </Marker>
               </MapContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              disabled={!coords || isLoading}
              className={`flex items-center justify-center py-3 px-4 text-white font-medium rounded-lg transition-all transform active:scale-95
                ${(!coords || isLoading) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Check-In
                </>
              )}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={isLoading}
              className={`flex items-center justify-center py-3 px-4 text-white font-medium rounded-lg transition-all transform active:scale-95
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}
            >
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <LogOut className="w-4 h-4 mr-2" /> Check-Out
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;