const Notifikasi = require('../models/Notifikasi');

module.exports = {

  // GET semua notifikasi user (paginated)
  getMyNotifications: async (req, res) => {
    try {
      let { halaman, limit } = req.query;
      halaman = parseInt(halaman) || 1;
      limit = parseInt(limit) || 10;
      const offset = (halaman - 1) * limit;

      const result = await Notifikasi.findAndCountAll({
        where: { id_user_target: req.user.id_user },
        order: [['dibuat_pada', 'DESC']],
        limit,
        offset
      });

      return res.status(200).json({
        total_data: result.count,
        total_halaman: Math.ceil(result.count / limit),
        halaman,
        limit,
        data: result.rows
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET jumlah notifikasi belum dibaca
  getUnreadCount: async (req, res) => {
    try {
      const count = await Notifikasi.count({
        where: { id_user_target: req.user.id_user, sudah_dibaca: 0 }
      });

      res.status(200).json({ unread: count });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tandai satu notifikasi sebagai sudah dibaca
  markAsRead: async (req, res) => {
    try {
      const { id_notifikasi } = req.params;

      const notif = await Notifikasi.findByPk(id_notifikasi);
      if (!notif || notif.id_user_target !== req.user.id_user) {
        return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
      }

      notif.sudah_dibaca = 1;
      await notif.save();

      res.status(200).json({ message: "Notifikasi ditandai sebagai sudah dibaca" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Tandai semua notifikasi user sebagai sudah dibaca
  markAllAsRead: async (req, res) => {
    try {
      await Notifikasi.update(
        { sudah_dibaca: 1 },
        { where: { id_user_target: req.user.id_user, sudah_dibaca: 0 } }
      );

      res.status(200).json({ message: "Semua notifikasi ditandai sudah dibaca" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};
