const jwt = require('jsonwebtoken');
// Pastikan secret key ini SAMA dengan yang ada di authController.js saat login
const secretKey = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Header format biasanya: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Penting: Menyimpan data user ke request
    next(); // Lanjut ke middleware berikutnya
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};