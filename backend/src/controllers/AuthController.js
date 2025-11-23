const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  
  // ============ REGISTER USER ============
  register: async (req, res) => {
    try {
      const { nama_lengkap, username, email, password } = req.body;

      if (!nama_lengkap || !username || !email || !password) {
        return res.status(400).json({ message: "Field tidak boleh kosong" });
      }

      const cekEmail = await User.findOne({ where: { email } });
      if (cekEmail) return res.status(400).json({ message: "Email sudah terdaftar" });

      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        nama_lengkap,
        username,
        email,
        password_hash: hash
      });

      return res.status(201).json({
        message: "Registrasi berhasil",
        data: {
          id_user: user.id_user,
          nama_lengkap,
          username,
          email
        }
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ============ LOGIN USER ============
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "Email tidak ditemukan" });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(400).json({ message: "Password salah" });

      const token = jwt.sign(
        { id_user: user.id_user, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id_user: user.id_user,
          nama_lengkap: user.nama_lengkap,
          username: user.username,
          role: user.role
        }
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ============ GET PROFILE ============
  profile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id_user);

      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      return res.status(200).json(user);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
