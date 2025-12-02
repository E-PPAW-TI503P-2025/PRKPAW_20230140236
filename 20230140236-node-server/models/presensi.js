'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // Relasi ke User
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'user' 
      });
    }
  }

  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Pastikan kolom 'nama' SUDAH DIHAPUS disini
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Tambahkan definisi Latitude & Longitude agar Sequelize bisa menyimpannya
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Presensi',
  });

  return Presensi;
};