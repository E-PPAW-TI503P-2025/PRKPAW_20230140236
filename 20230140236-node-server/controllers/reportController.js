// 1. Import User juga karena kita butuh relasi
const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, checkIn, checkOut } = req.query;
    
    // Inisialisasi 'where' khusus untuk tabel Presensi
    let wherePresensi = {};

    // Filter berdasarkan tanggal checkIn
    if (checkIn) {
      const startOfDay = new Date(`${checkIn}T00:00:00.000Z`);
      const endOfDay = new Date(`${checkIn}T23:59:59.999Z`);
      wherePresensi.checkIn = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // Filter berdasarkan tanggal checkOut
    if (checkOut) {
      const startOfDay = new Date(`${checkOut}T00:00:00.000Z`);
      const endOfDay = new Date(`${checkOut}T23:59:59.999Z`);
      wherePresensi.checkOut = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // Konfigurasi Include (Join ke Tabel User)
    // Gunakan alias 'user' sesuai yang Anda buat di models/presensi.js (as: 'user')
    let userInclude = {
      model: User,
      as: 'user', 
      attributes: ['nama', 'email'], // Ambil kolom yang dibutuhkan saja
    };

    // Filter Nama dipindahkan ke sini (karena nama ada di tabel User)
    if (nama) {
      userInclude.where = {
        nama: {
          [Op.like]: `%${nama}%`,
        },
      };
    }

    // 2. Ambil data dari database dengan Relasi
    const records = await Presensi.findAll({
    where: wherePresensi,
    include: [{ 
      model: User, 
      as: 'user', 
      attributes: ['nama', 'email'] 
    }], 
    order: [['checkIn', 'DESC']]
    });

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      totalRecords: records.length,
      filters: { nama, checkIn, checkOut },
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};