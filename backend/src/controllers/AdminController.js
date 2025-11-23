const User = require('../models/User');
const KaryaSeni = require('../models/KaryaSeni');
const KategoriKarya = require('../models/KategoriKarya');
const KomentarKarya = require('../models/KomentarKarya');
const PenawaranKarya = require('../models/PenawaranKarya');
const { buatNotifikasi } = require('../utils/NotificationService');

module.exports = {

  // ============================================================
  // 1️⃣ ADMIN VERIFIKASI KARYA SENI
  // ============================================================

  verifikasiKarya: async (req, res) => {
    try {
      const { id_karya } = req.params;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      karya.status_publikasi = "Publish"; // hasil verifikasi
      await karya.save();

      // 🔔 NOTIFIKASI: KARYA DIVERIFIKASI
      await buatNotifikasi(
        karya.id_user,
        'verifikasi_karya',
        'Karyamu telah diverifikasi',
        `Karya "${karya.judul_karya}" telah diverifikasi dan kini tampil di halaman publik.`,
        { id_karya: karya.id_karya }
      );

      res.status(200).json({
        message: "Karya berhasil diverifikasi dan dipublish",
        data: karya
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 2️⃣ ADMIN TOLAK KARYA SENI
  // ============================================================

  tolakKarya: async (req, res) => {
    try {
      const { id_karya } = req.params;
      const { alasan } = req.body;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      karya.status_publikasi = "Arsip";
      karya.alasan_ditolak = alasan || "Tidak memenuhi syarat verifikasi";
      await karya.save();

      // 🔔 NOTIFIKASI: KARYA DITOLAK
      await buatNotifikasi(
        karya.id_user,
        'tolak_karya',
        'Karyamu ditolak',
        `Karya "${karya.judul_karya}" ditolak: ${karya.alasan_ditolak}`,
        { id_karya: karya.id_karya }
      );

      res.status(200).json({
        message: "Karya berhasil ditolak & diarsipkan",
        alasan: karya.alasan_ditolak
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 3️⃣ ADMIN HAPUS KARYA SENI
  // ============================================================

  hapusKarya: async (req, res) => {
    try {
      const { id_karya } = req.params;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      await karya.destroy();

      res.status(200).json({ message: "Karya berhasil dihapus oleh admin" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 4️⃣ ADMIN BAN USER
  // ============================================================

  banUser: async (req, res) => {
    try {
      const { id_user } = req.params;

      const user = await User.findByPk(id_user);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      user.status_akun = "dibanned";
      await user.save();

      res.status(200).json({
        message: "User berhasil dibanned",
        data: user
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 5️⃣ ADMIN UNBAN USER
  // ============================================================

  unbanUser: async (req, res) => {
    try {
      const { id_user } = req.params;

      const user = await User.findByPk(id_user);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      user.status_akun = "aktif";
      await user.save();

      res.status(200).json({
        message: "User berhasil diaktifkan kembali",
        data: user
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 6️⃣ ADMIN DASHBOARD STATISTIK
  // ============================================================

  dashboard: async (req, res) => {
    try {
      const total_karya = await KaryaSeni.count();
      const total_kategori = await KategoriKarya.count();
      const total_user = await User.count();
      const total_terverifikasi = await KaryaSeni.count({
        where: { status_publikasi: 'Publish' }
      });

      const user_aktif = await User.count({
        where: { status_akun: 'aktif' }
      });

      const karya_populer = await KaryaSeni.findAll({
        limit: 5,
        order: [['jumlah_like', 'DESC']],
        attributes: ['id_karya', 'judul_karya', 'jumlah_like']
      });

      res.status(200).json({
        total_karya,
        total_kategori,
        total_user,
        user_aktif,
        total_terverifikasi,
        top_5_populer: karya_populer
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============================================================
  // 7️⃣ SEMUA KARYA (admin view)
  // ============================================================

  semuaKarya: async (req, res) => {
    try {
      const karya = await KaryaSeni.findAll({
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] },
          { model: KategoriKarya, attributes: ['nama_kategori'] }
        ],
        order: [['dibuat_pada', 'DESC']]
      });

      res.status(200).json(karya);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
