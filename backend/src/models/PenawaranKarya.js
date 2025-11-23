const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PenawaranKarya = sequelize.define('PenawaranKarya', {
  id_penawaran: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_karya: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  id_user_penawar: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  nilai_penawaran: {
    type: DataTypes.DECIMAL(15,2),
    allowNull: false
  },
  status_penawaran: {
    type: DataTypes.ENUM('aktif','diterima','ditolak','dibatalkan'),
    defaultValue: 'aktif'
  },
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'penawaran_karya',
  timestamps: false
});

module.exports = PenawaranKarya;
