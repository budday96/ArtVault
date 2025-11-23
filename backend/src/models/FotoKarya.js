const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FotoKarya = sequelize.define('FotoKarya', {
  id_foto: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  id_karya: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  path_file: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  urutan: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  is_cover: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'foto_karya',
  timestamps: false
});

module.exports = FotoKarya;
