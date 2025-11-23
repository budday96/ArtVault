const LikeKarya = require('../models/LikeKarya');
const KaryaSeni = require('../models/KaryaSeni');
const User = require('../models/User');
const { buatNotifikasi } = require('../utils/NotificationService');

module.exports = {

  // ==================== TOGGLE LIKE ====================
  toggleLike: async (req, res) => {
    try {
      const { id_karya } = req.params;
      const id_user = req.user.id_user;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya)
        return res.status(404).json({ message: "Karya tidak ditemukan" });

      // cek apakah user sudah like sebelumnya
      const likeExist = await LikeKarya.findOne({
        where: { id_karya, id_user }
      });

      if (likeExist) {
        // === UNLIKE ===
        await likeExist.destroy();

        karya.jumlah_like = karya.jumlah_like - 1;
        if (karya.jumlah_like < 0) karya.jumlah_like = 0;

        await karya.save();

        return res.status(200).json({
          message: "Unlike berhasil",
          liked: false,
          total_like: karya.jumlah_like
        });

      } else {
        // === LIKE ===
        await LikeKarya.create({
          id_karya,
          id_user
        });

        karya.jumlah_like = karya.jumlah_like + 1;
        await karya.save();

        // =======================
        // 🔔 KIRIM NOTIFIKASI LIKE
        // =======================
        if (karya.id_user !== id_user) { // jangan notif kalau like karya sendiri
          await buatNotifikasi(
            karya.id_user, // penerima pemilik karya
            'like',        // tipe notifikasi
            'Karyamu mendapat like baru',
            `${req.user.nama || 'Seorang pengguna'} menyukai karya "${karya.judul_karya}"`,
            { id_karya: karya.id_karya }
          );
        }

        return res.status(201).json({
          message: "Like berhasil",
          liked: true,
          total_like: karya.jumlah_like
        });
      }

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ==================== GET TOTAL LIKE ====================
  getLikes: async (req, res) => {
    try {
      const { id_karya } = req.params;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya)
        return res.status(404).json({ message: "Karya tidak ditemukan" });

      res.status(200).json({
        id_karya,
        total_like: karya.jumlah_like
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
