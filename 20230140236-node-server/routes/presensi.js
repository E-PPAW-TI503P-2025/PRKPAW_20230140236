const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { verifyToken } = require('../middleware/permissionMiddleware'); // Pastikan path ini benar

// Middleware verifyToken WAJIB ada agar controller bisa baca req.user
// Tanpa ini, CheckIn akan error 500
router.post('/check-in', verifyToken, presensiController.CheckIn);
router.post('/check-out', verifyToken, presensiController.CheckOut);

// Route tambahan (opsional, jika Anda punya fungsi delete/update)
router.delete('/:id', verifyToken, presensiController.deletePresensi);
router.put('/:id', verifyToken, presensiController.updatePresensi);

// Route riwayat presensi (untuk ReportPage mahasiswa)
// Jika controller Anda punya fungsi getRiwayat
// router.get('/riwayat', verifyToken, presensiController.getRiwayat); 

module.exports = router;