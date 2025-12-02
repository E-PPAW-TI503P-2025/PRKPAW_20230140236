// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// HARUS sama dengan secretKey di login controller
const secretKey = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // Simpan data user agar bisa dipakai middleware lain & presensi controller
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};
