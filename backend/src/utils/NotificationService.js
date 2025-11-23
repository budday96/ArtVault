const Notifikasi = require('../models/Notifikasi');

async function buatNotifikasi(id_user_target, tipe, judul, pesan, data_tambahan = null) {
  if (!id_user_target) return;

  return await Notifikasi.create({
    id_user_target,
    tipe_notifikasi: tipe,
    judul,
    pesan,
    data_tambahan
  });
}

module.exports = { buatNotifikasi };
