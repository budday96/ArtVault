const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KaryaSeni = sequelize.define('KaryaSeni', {
  id_karya: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  id_kategori: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  judul_karya: DataTypes.STRING(150),
  pembuat: DataTypes.STRING(150),
  tahun_pembuatan: DataTypes.INTEGER,
  nilai_historis: DataTypes.TINYINT,
  kelangkaan: DataTypes.TINYINT,

  kondisi: {
    type: DataTypes.ENUM('Sangat Baik','Baik','Sedang','Buruk','Rusak'),
    defaultValue: 'Baik'
  },

  estimasi_harga: DataTypes.DECIMAL(15,2),
  skor_nilai: DataTypes.DECIMAL(6,2),
  popularitas: DataTypes.DECIMAL(8,2),

  deskripsi: DataTypes.TEXT,

  status_publikasi: {
    type: DataTypes.ENUM('Draft','Publish','Arsip'),
    defaultValue: 'Draft'
  },

  jumlah_like: DataTypes.INTEGER,
  jumlah_komentar: DataTypes.INTEGER,
  penawaran_tertinggi: DataTypes.DECIMAL(15,2),

  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  diupdate_pada: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'karya_seni',
  timestamps: false
});

module.exports = KaryaSeni;
