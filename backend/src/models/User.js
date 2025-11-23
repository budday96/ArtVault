const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'kolektor'),
    defaultValue: 'kolektor'
  },
  level_kolektor: {
    type: DataTypes.ENUM('beginner','pro','master'),
    defaultValue: 'beginner'
  },
  status_akun: {
    type: DataTypes.ENUM('aktif','dibanned'),
    defaultValue: 'aktif'
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;
