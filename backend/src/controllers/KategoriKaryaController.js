const KategoriKarya = require('../models/KategoriKarya');

// helper untuk bikin slug
const makeSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, '-')        // spasi & underscore → strip
    .replace(/[^a-z0-9\-]+/g, '')    // buang karakter aneh
    .replace(/\-\-+/g, '-');         // hilangkan strip berulang
};

module.exports = {

  // ================== CREATE ==================
  create: async (req, res) => {
    try {
      const { nama_kategori, deskripsi, urutan } = req.body;

      if (!nama_kategori) {
        return res.status(400).json({ message: "nama_kategori wajib diisi" });
      }

      let slug = makeSlug(nama_kategori);

      // cek slug unik, kalau sudah ada tambahi angka
      let slugAsli = slug;
      let i = 1;
      let exists = await KategoriKarya.findOne({ where: { slug } });
      while (exists) {
        slug = `${slugAsli}-${i}`;
        exists = await KategoriKarya.findOne({ where: { slug } });
        i++;
      }

      const kategori = await KategoriKarya.create({
        nama_kategori,
        slug,
        deskripsi: deskripsi || null,
        urutan: urutan || 0,
        aktif: 1
      });

      return res.status(201).json({
        message: "Kategori berhasil dibuat",
        data: kategori
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ================== GET ALL (PUBLIC) ==================
  getAll: async (req, res) => {
    try {
      // default: hanya kategori aktif
      const { include_nonaktif } = req.query;
      const whereClause = {};

      if (!include_nonaktif) {
        whereClause.aktif = 1;
      }

      const kategori = await KategoriKarya.findAll({
        where: whereClause,
        order: [['urutan', 'ASC'], ['nama_kategori', 'ASC']]
      });

      return res.status(200).json(kategori);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ================== GET BY ID ==================
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const kategori = await KategoriKarya.findByPk(id);

      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      return res.status(200).json(kategori);

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ================== UPDATE ==================
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori, deskripsi, urutan, aktif } = req.body;

      const kategori = await KategoriKarya.findByPk(id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      if (nama_kategori) {
        kategori.nama_kategori = nama_kategori;
        // opsional: update slug juga
        let slug = makeSlug(nama_kategori);
        let slugAsli = slug;
        let i = 1;
        let exists = await KategoriKarya.findOne({ 
          where: { slug, id_kategori: { [require('sequelize').Op.ne]: id } }
        });
        while (exists) {
          slug = `${slugAsli}-${i}`;
          exists = await KategoriKarya.findOne({ 
            where: { slug, id_kategori: { [require('sequelize').Op.ne]: id } }
          });
          i++;
        }
        kategori.slug = slug;
      }

      if (typeof deskripsi !== 'undefined') kategori.deskripsi = deskripsi;
      if (typeof urutan !== 'undefined') kategori.urutan = urutan;
      if (typeof aktif !== 'undefined') kategori.aktif = aktif;

      await kategori.save();

      return res.status(200).json({
        message: "Kategori berhasil diupdate",
        data: kategori
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ================== SOFT DELETE (SET AKTIF=0) ==================
  softDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const kategori = await KategoriKarya.findByPk(id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      kategori.aktif = 0;
      await kategori.save();

      return res.status(200).json({ message: "Kategori dinonaktifkan" });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

};
