const KaryaSeni = require('../models/KaryaSeni');
const KategoriKarya = require('../models/KategoriKarya');
const User = require('../models/User');
const { Op } = require('sequelize');

const kondisiToValue = {
  "Sangat Baik": 5,
  "Baik": 4,
  "Sedang": 3,
  "Buruk": 2,
  "Rusak": 1
};

module.exports = {

  // ============ CREATE ============  
  create: async (req, res) => {
    try {
      const {
        judul_karya,
        pembuat,
        tahun_pembuatan,
        nilai_historis,
        kelangkaan,
        kondisi,
        estimasi_harga,
        deskripsi,
        id_kategori
      } = req.body;

      // validasi minimal
      if (!judul_karya || !id_kategori || !kelangkaan || !nilai_historis || !kondisi) {
        return res.status(400).json({ message: "Field wajib tidak boleh kosong" });
      }

      // cek kategori
      const kategori = await KategoriKarya.findByPk(id_kategori);
      if (!kategori) {
        return res.status(400).json({ message: "Kategori tidak valid" });
      }

      // hitung skor
      const skor =
        (kelangkaan * 0.5) +
        (kondisiToValue[kondisi] * 0.3) +
        (nilai_historis * 0.2);

      const karya = await KaryaSeni.create({
        id_user: req.user.id_user,
        id_kategori,
        judul_karya,
        pembuat,
        tahun_pembuatan,
        nilai_historis,
        kelangkaan,
        kondisi,
        estimasi_harga,
        deskripsi,
        skor_nilai: skor.toFixed(2),
        status_publikasi: "Draft",
        jumlah_like: 0,
        jumlah_komentar: 0,
        penawaran_tertinggi: null
      });

      return res.status(201).json({
        message: "Karya berhasil dibuat",
        data: karya
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ============ READ ALL (Explore / Dashboard) ============  
  getAll: async (req, res) => {
    try {
      const karya = await KaryaSeni.findAll({
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] },
          { model: KategoriKarya, attributes: ['nama_kategori'] }
        ],
        order: [['dibuat_pada', 'DESC']]
      });

      return res.status(200).json(karya);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ============ READ BY ID ============  
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const karya = await KaryaSeni.findByPk(id, {
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] },
          { model: KategoriKarya, attributes: ['nama_kategori'] }
        ]
      });

      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      return res.status(200).json(karya);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


    // ============ GET MY KARYA (USER SENDIRI) ============
  getMyKarya: async (req, res) => {
    try {
      const karya = await KaryaSeni.findAll({
        where: { id_user: req.user.id_user },
        include: [
          { model: KategoriKarya, attributes: ['nama_kategori'] }
        ],
        order: [['dibuat_pada', 'DESC']]
      });

      return res.status(200).json(karya);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  // ============ UPDATE ============  
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const karya = await KaryaSeni.findByPk(id);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      // hanya pemilik yang boleh edit
      if (karya.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Anda bukan pemilik karya" });
      }

      const {
        judul_karya,
        pembuat,
        tahun_pembuatan,
        nilai_historis,
        kelangkaan,
        kondisi,
        estimasi_harga,
        deskripsi,
        status_publikasi
      } = req.body;

      // update value
      if (judul_karya) karya.judul_karya = judul_karya;
      if (pembuat) karya.pembuat = pembuat;
      if (tahun_pembuatan) karya.tahun_pembuatan = tahun_pembuatan;
      if (nilai_historis) karya.nilai_historis = nilai_historis;
      if (kelangkaan) karya.kelangkaan = kelangkaan;
      if (kondisi) karya.kondisi = kondisi;
      if (estimasi_harga) karya.estimasi_harga = estimasi_harga;
      if (deskripsi) karya.deskripsi = deskripsi;
      if (status_publikasi) karya.status_publikasi = status_publikasi;

      // hitung ulang skor jika ada perubahan
      karya.skor_nilai =
        (karya.kelangkaan * 0.5) +
        (kondisiToValue[karya.kondisi] * 0.3) +
        (karya.nilai_historis * 0.2);

      karya.diupdate_pada = new Date();

      await karya.save();

      res.status(200).json({
        message: "Karya berhasil diupdate",
        data: karya
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ============ DELETE ============
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const karya = await KaryaSeni.findByPk(id);
      if (!karya) return res.status(404).json({ message: "Karya tidak ditemukan" });

      if (karya.id_user !== req.user.id_user) {
        return res.status(403).json({ message: "Anda tidak berhak menghapus karya ini" });
      }

      await karya.destroy();

      res.status(200).json({ message: "Karya berhasil dihapus" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
