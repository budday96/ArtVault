const { Op, Sequelize } = require('sequelize');
const KaryaSeni = require('../models/KaryaSeni');
const User = require('../models/User');
const KategoriKarya = require('../models/KategoriKarya');
const FotoKarya = require('../models/FotoKarya');

module.exports = {

  explore: async (req, res) => {
    try {
      let { sort, kategori, kondisi, kelangkaan, harga_min, harga_max, halaman, limit } = req.query;

      halaman = parseInt(halaman) || 1;
      limit = parseInt(limit) || 12;
      const offset = (halaman - 1) * limit;

      const whereClause = { status_publikasi: 'Publish' };
      if (kategori) whereClause.id_kategori = kategori;
      if (kondisi) whereClause.kondisi = kondisi;
      if (kelangkaan) whereClause.kelangkaan = kelangkaan;
      if (harga_min) whereClause.estimasi_harga = { [Op.gte]: harga_min };
      if (harga_max)
        whereClause.estimasi_harga = {
          ...(whereClause.estimasi_harga || {}),
          [Op.lte]: harga_max,
        };

      let order = [['dibuat_pada', 'DESC']];
      if (sort === 'skor') order = [['skor_nilai', 'DESC']];
      if (sort === 'penawaran') order = [['penawaran_tertinggi', 'DESC']];
      if (sort === 'populer')
        order = [
          [Sequelize.literal('(jumlah_like*2 + jumlah_komentar + IFNULL(penawaran_tertinggi,0))'), 'DESC']
        ];
      if (sort === 'trending') order = [['popularitas', 'DESC']];
      if (sort === 'terlama') order = [['dibuat_pada', 'ASC']];

      const karya = await KaryaSeni.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] },
          { model: KategoriKarya, attributes: ['nama_kategori'] },
          {
            model: FotoKarya,
            attributes: ['id_foto', 'path_file', 'is_cover'],
            separate: true,
            order: [['is_cover', 'DESC'], ['id_foto', 'ASC']]
          }
        ],
        order,
        limit,
        offset
      });

      return res.status(200).json({
        total_data: karya.count,
        total_halaman: Math.ceil(karya.count / limit),
        halaman,
        limit,
        data: karya.rows
      });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
