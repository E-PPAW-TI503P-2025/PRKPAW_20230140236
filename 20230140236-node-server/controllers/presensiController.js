const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.CheckIn = async (req, res) => {
  try {
    // 1. Ambil data user
    // Prioritaskan req.userData (dari permissionMiddleware), fallback ke req.user (jika middleware belum terpasang)
    const userSession = req.userData || req.user;

    // Validasi keberadaan user
    if (!userSession) {
        return res.status(401).json({ message: "User tidak terautentikasi (Data user tidak ditemukan di request)" });
    }

    const { id: userId, nama: userName } = userSession; 
    const { latitude, longitude } = req.body; 
    const waktuSekarang = new Date();

    const buktiFoto = req.file ? req.file.path : null; 

    // Cek double check-in
    const existingRecord = await Presensi.findOne({
      where: { 
        userId: userId, 
        checkOut: null 
      },
    });

    if (existingRecord) {
      return res.status(400).json({ 
        message: "Anda sudah melakukan check-in dan belum check-out." 
      });
    }

    // Simpan ke database
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude, 
      longitude: longitude, 
      buktiFoto: buktiFoto // Simpan path foto
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    // 1. Ambil data user dari req.userData atau req.user
    const userSession = req.userData || req.user;

    if (!userSession) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const { id: userId, nama: userName } = userSession;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { 
        userId: userId, 
        checkOut: null 
      },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// Fungsi dummy agar router tidak error jika belum ada implementasi detail
exports.deletePresensi = async (req, res) => {
    // Pastikan userSession ada jika nanti diimplementasikan
    // const userSession = req.userData || req.user;
    res.status(501).json({ message: "Not Implemented yet" });
};

exports.updatePresensi = async (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
};