const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notifikasi = sequelize.define('Notifikasi', {
  id_notifikasi: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_user_target: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  tipe_notifikasi: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  judul: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  pesan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data_tambahan: {
    type: DataTypes.JSON,
    allowNull: true
  },
  sudah_dibaca: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifikasi',
  timestamps: false
});

module.exports = Notifikasi;
