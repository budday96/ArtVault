const { Op, Sequelize } = require('sequelize');
const KaryaSeni = require('../models/KaryaSeni');
const User = require('../models/User');
const KategoriKarya = require('../models/KategoriKarya');

module.exports = {

  // ========================= EXPLORE =========================
  explore: async (req, res) => {
    try {
      let {
        sort,
        kategori,
        kondisi,
        kelangkaan,
        harga_min,
        harga_max,
        halaman,
        limit
      } = req.query;

      // default values
      halaman = parseInt(halaman) || 1;
      limit = parseInt(limit) || 12;

      const offset = (halaman - 1) * limit;

      // ========================= FILTER =========================
      const whereClause = {
        status_publikasi: 'Publish'
      };

      if (kategori) whereClause.id_kategori = kategori;
      if (kondisi) whereClause.kondisi = kondisi;
      if (kelangkaan) whereClause.kelangkaan = kelangkaan;

      if (harga_min) whereClause.estimasi_harga = { [Op.gte]: harga_min };
      if (harga_max)
        whereClause.estimasi_harga = {
          ...(whereClause.estimasi_harga || {}),
          [Op.lte]: harga_max
        };

      // ========================= SORTING =========================
      let order = [['dibuat_pada', 'DESC']]; // default: terbaru

      switch (sort) {
        case 'skor':
          order = [['skor_nilai', 'DESC']];
          break;

        case 'penawaran':
          order = [['penawaran_tertinggi', 'DESC']];
          break;

        case 'populer':
          order = [
            [
              Sequelize.literal(
                '(jumlah_like * 2 + jumlah_komentar * 1 + IFNULL(penawaran_tertinggi, 0))'
              ),
              'DESC'
            ]
          ];
          break;

        case 'trending':
          // trending = karya yang punya interaksi terbanyak 7 hari terakhir
          // Kita sederhana: order by popularitas stored
          order = [['popularitas', 'DESC']];
          break;

        case 'terlama':
          order = [['dibuat_pada', 'ASC']];
          break;
      }

      // ========================= QUERY =========================
      const karya = await KaryaSeni.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, attributes: ['nama_lengkap', 'username'] },
          { model: KategoriKarya, attributes: ['nama_kategori'] }
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
