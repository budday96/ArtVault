const PenawaranKarya = require('../models/PenawaranKarya');
const KaryaSeni = require('../models/KaryaSeni');
const User = require('../models/User');
const { buatNotifikasi } = require('../utils/NotificationService');

module.exports = {

  // ========================= TAMBAH PENAWARAN =========================
  tambahPenawaran: async (req, res) => {
    try {
      const id_karya = req.params.id_karya;
      const { nilai_penawaran } = req.body;
      const id_user_penawar = req.user.id_user;

      if (!nilai_penawaran) {
        return res.status(400).json({ message: "Nilai penawaran wajib diisi" });
      }

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) {
        return res.status(404).json({ message: "Karya tidak ditemukan" });
      }

      // tidak boleh menawar karya sendiri
      if (karya.id_user === id_user_penawar) {
        return res.status(403).json({ message: "Tidak boleh menawar karya milik sendiri" });
      }

      // Cek penawaran tertinggi saat ini
      const highestBid = karya.penawaran_tertinggi || 0;

      if (Number(nilai_penawaran) <= Number(highestBid)) {
        return res.status(400).json({
          message: "Penawaran harus lebih tinggi dari penawaran sebelumnya",
          highestBid
        });
      }

      // Simpan penawaran baru
      const penawaran = await PenawaranKarya.create({
        id_karya,
        id_user_penawar,
        nilai_penawaran,
        status_penawaran: "aktif"
      });

      // Update nilai tertinggi di tabel karya
      karya.penawaran_tertinggi = nilai_penawaran;
      await karya.save();

      // ===================================================
      // 🔔 NOTIFIKASI: KARYA MENDAPAT PENAWARAN BARU
      // ===================================================
      await buatNotifikasi(
        karya.id_user,
        'penawaran',
        'Karyamu mendapat penawaran baru',
        `Ada penawaran baru sebesar ${nilai_penawaran} pada karya "${karya.judul_karya}"`,
        { id_karya: karya.id_karya, nilai_penawaran }
      );

      res.status(201).json({
        message: "Penawaran berhasil",
        data: penawaran,
        penawaran_tertinggi: nilai_penawaran
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========================= LIST PENAWARAN KARYA =========================
  getByKarya: async (req, res) => {
    try {
      const id_karya = req.params.id_karya;

      const penawaran = await PenawaranKarya.findAll({
        where: { id_karya },
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] }
        ],
        order: [['nilai_penawaran', 'DESC']]
      });

      res.status(200).json(penawaran);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========================= HISTORI PENAWARAN USER =========================
  getByUser: async (req, res) => {
    try {
      const id_user = req.user.id_user;

      const penawaran = await PenawaranKarya.findAll({
        where: { id_user_penawar: id_user },
        include: [
          { model: KaryaSeni, attributes: ['judul_karya'] }
        ],
        order: [['dibuat_pada', 'DESC']]
      });

      res.status(200).json(penawaran);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
