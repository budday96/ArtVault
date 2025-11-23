const KomentarKarya = require('../models/KomentarKarya');
const KaryaSeni = require('../models/KaryaSeni');
const User = require('../models/User');
const { buatNotifikasi } = require('../utils/NotificationService');

module.exports = {

  // ========================= CREATE KOMENTAR =========================
  create: async (req, res) => {
    try {
      const { id_karya } = req.params;
      const { isi_komentar, id_komentar_parent } = req.body;

      if (!isi_komentar) {
        return res.status(400).json({ message: "Komentar tidak boleh kosong" });
      }

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      // buat komentar
      const komentar = await KomentarKarya.create({
        id_karya,
        id_user: req.user.id_user,
        isi_komentar,
        id_komentar_parent: id_komentar_parent || null
      });

      // update counter komentar
      karya.jumlah_komentar = karya.jumlah_komentar + 1;
      await karya.save();

      // ======================================================
      // 🔔 NOTIFIKASI UTAMA: KOMENTAR BARU PADA KARYA
      // ======================================================
      if (karya.id_user !== req.user.id_user) {
        await buatNotifikasi(
          karya.id_user,
          'komentar',
          'Karyamu dikomentari',
          `Ada komentar baru pada karya "${karya.judul_karya}"`,
          { id_karya: karya.id_karya }
        );
      }

      // ======================================================
      // 🔔 NOTIFIKASI BALASAN KOMENTAR (REPLY)
      // ======================================================
      if (id_komentar_parent) {
        const parent = await KomentarKarya.findByPk(id_komentar_parent);

        // pastikan parent ada & bukan komentar sendiri & bukan pemilik karya (agar tidak double notif)
        if (
          parent &&
          parent.id_user !== req.user.id_user &&
          parent.id_user !== karya.id_user
        ) {
          await buatNotifikasi(
            parent.id_user,
            'balasan_komentar',
            'Komentarmu mendapat balasan',
            `Komentarmu pada karya "${karya.judul_karya}" mendapat balasan`,
            { id_karya: karya.id_karya, id_komentar_parent }
          );
        }
      }

      res.status(201).json({
        message: "Komentar berhasil ditambahkan",
        data: komentar
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========================= GET ALL KOMENTAR =========================
  getByKarya: async (req, res) => {
    try {
      const { id_karya } = req.params;

      const komentar = await KomentarKarya.findAll({
        where: { id_karya, id_komentar_parent: null },
        include: [
          {
            model: User,
            attributes: ['nama_lengkap', 'username']
          },
          {
            model: KomentarKarya,
            as: 'replies',
            include: [
              { model: User, attributes: ['nama_lengkap', 'username'] }
            ]
          }
        ],
        order: [['dibuat_pada', 'ASC']]
      });

      res.status(200).json(komentar);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========================= EDIT KOMENTAR =========================
  update: async (req, res) => {
    try {
      const { id_komentar } = req.params;
      const { isi_komentar } = req.body;

      const komentar = await KomentarKarya.findByPk(id_komentar);
      if (!komentar) return res.status(404).json({ message: "Komentar tidak ditemukan" });

      // hanya pemilik komentar
      if (komentar.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Tidak boleh mengedit komentar orang lain" });
      }

      komentar.isi_komentar = isi_komentar;
      komentar.diupdate_pada = new Date();
      await komentar.save();

      res.status(200).json({ message: "Komentar berhasil diupdate", komentar });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ========================= DELETE KOMENTAR =========================
  delete: async (req, res) => {
    try {
      const { id_komentar } = req.params;

      const komentar = await KomentarKarya.findByPk(id_komentar);
      if (!komentar) return res.status(404).json({ message: "Komentar tidak ditemukan" });

      if (komentar.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Tidak boleh menghapus komentar orang lain" });
      }

      // soft delete
      komentar.status_komentar = "dihapus";
      komentar.isi_komentar = "[Komentar telah dihapus]";
      await komentar.save();

      // kurangi jumlah komentar karya
      const karya = await KaryaSeni.findByPk(komentar.id_karya);
      karya.jumlah_komentar = karya.jumlah_komentar - 1;
      if (karya.jumlah_komentar < 0) karya.jumlah_komentar = 0;
      await karya.save();

      res.status(200).json({ message: "Komentar berhasil dihapus" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
