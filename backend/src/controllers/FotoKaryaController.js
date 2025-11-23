const FotoKarya = require('../models/FotoKarya');
const KaryaSeni = require('../models/KaryaSeni');
const fs = require('fs');
const db = require('../config/db');

module.exports = {

  // ====================== UPLOAD MULTIPLE FOTO ======================
  uploadMultiple: async (req, res) => {
    try {
      const id_karya = req.params.id;

      const karya = await KaryaSeni.findByPk(id_karya);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      // hanya pemilik karya
      if (karya.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Tidak boleh upload foto untuk karya orang lain" });
      }

      // multer menaruh file ke req.files
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Tidak ada file yang diupload" });
      }

      const fotoData = [];

      for (let i = 0; i < files.length; i++) {
        const foto = await FotoKarya.create({
          id_karya,
          path_file: '/uploads/karya/' + files[i].filename,
          urutan: i,
          is_cover: 0
        });

        fotoData.push(foto);
      }

      res.status(201).json({
        message: "Upload foto berhasil",
        data: fotoData
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ====================== SET COVER ======================
  setCover: async (req, res) => {
    try {
      const { id_foto } = req.params;

      const foto = await FotoKarya.findByPk(id_foto);
      if (!foto) return res.status(404).json({ message: "Foto tidak ditemukan" });

      const karya = await KaryaSeni.findByPk(foto.id_karya);

      if (karya.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Bukan pemilik karya" });
      }

      // reset semua is_cover = 0
      await FotoKarya.update(
        { is_cover: 0 },
        { where: { id_karya: foto.id_karya } }
      );

      foto.is_cover = 1;
      await foto.save();

      res.status(200).json({ message: "Cover berhasil diset", data: foto });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ====================== DELETE FOTO ======================
  deleteFoto: async (req, res) => {
    try {
      const { id_foto } = req.params;

      const foto = await FotoKarya.findByPk(id_foto);
      if (!foto) return res.status(404).json({ message: "Foto tidak ditemukan" });

      const karya = await KaryaSeni.findByPk(foto.id_karya);
      if (karya.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Tidak boleh menghapus foto milik orang lain" });
      }

      // hapus file dari server
      const filePath = '.' + foto.path_file;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // hapus dari database
      await foto.destroy();

      res.status(200).json({ message: "Foto berhasil dihapus" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
