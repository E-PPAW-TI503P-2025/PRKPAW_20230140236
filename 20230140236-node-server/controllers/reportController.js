const presensiRecords = require("../data/presensiData");
const { CheckIn } = require("./presensiController");

const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, checkIn, checkOut } = req.query; // ambil semua query param
    let options = { where: {} };

    // 🔹 Filter berdasarkan nama (LIKE)
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // 🔹 Filter berdasarkan tanggal checkIn
    if (checkIn) {
      const startOfDay = new Date(`${checkIn}T00:00:00.000Z`);
      const endOfDay = new Date(`${checkIn}T23:59:59.999Z`);

      options.where.checkIn = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // 🔹 Filter berdasarkan tanggal checkOut
    if (checkOut) {
      const startOfDay = new Date(`${checkOut}T00:00:00.000Z`);
      const endOfDay = new Date(`${checkOut}T23:59:59.999Z`);

      options.where.checkOut = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    // 🔹 Ambil data dari database
    const records = await Presensi.findAll(options);

    // 🔹 Kirim hasil dalam format JSON
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


