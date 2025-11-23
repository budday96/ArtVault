const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KomentarKarya = sequelize.define('KomentarKarya', {
  id_komentar: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_karya: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  id_user: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  id_komentar_parent: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true
  },
  isi_komentar: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status_komentar: {
    type: DataTypes.ENUM('normal','dilaporkan','dihapus'),
    defaultValue: 'normal'
  },
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  diupdate_pada: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'komentar_karya',
  timestamps: false
});

module.exports = KomentarKarya;
