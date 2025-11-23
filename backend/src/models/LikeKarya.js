const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LikeKarya = sequelize.define('LikeKarya', {
  id_like: {
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
  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'like_karya',
  timestamps: false
});

module.exports = LikeKarya;
