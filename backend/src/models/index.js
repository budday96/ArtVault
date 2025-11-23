const User = require('./User');
const KategoriKarya = require('./KategoriKarya');
const KaryaSeni = require('./KaryaSeni');
const FotoKarya = require('./FotoKarya');
const LikeKarya = require('./LikeKarya');
const KomentarKarya = require('./KomentarKarya');
const PenawaranKarya = require('./PenawaranKarya');
const Notifikasi = require('./Notifikasi');

// ============================
//   DEFINISI RELASI
// ============================

// User 1 - N KaryaSeni
User.hasMany(KaryaSeni, { foreignKey: 'id_user' });
KaryaSeni.belongsTo(User, { foreignKey: 'id_user' });

// Kategori 1 - N Karya
KategoriKarya.hasMany(KaryaSeni, { foreignKey: 'id_kategori' });
KaryaSeni.belongsTo(KategoriKarya, { foreignKey: 'id_kategori' });

// Karya 1 - N FotoKarya
KaryaSeni.hasMany(FotoKarya, { foreignKey: 'id_karya' });
FotoKarya.belongsTo(KaryaSeni, { foreignKey: 'id_karya' });

KaryaSeni.hasMany(LikeKarya, { foreignKey: 'id_karya' });
LikeKarya.belongsTo(KaryaSeni, { foreignKey: 'id_karya' });

User.hasMany(LikeKarya, { foreignKey: 'id_user' });
LikeKarya.belongsTo(User, { foreignKey: 'id_user' });

KaryaSeni.hasMany(KomentarKarya, { foreignKey: 'id_karya' });
KomentarKarya.belongsTo(KaryaSeni, { foreignKey: 'id_karya' });

User.hasMany(KomentarKarya, { foreignKey: 'id_user' });
KomentarKarya.belongsTo(User, { foreignKey: 'id_user' });

KomentarKarya.hasMany(KomentarKarya, { 
  foreignKey: 'id_komentar_parent', 
  as: 'replies' 
});

KaryaSeni.hasMany(PenawaranKarya, { foreignKey: 'id_karya' });
PenawaranKarya.belongsTo(KaryaSeni, { foreignKey: 'id_karya' });

User.hasMany(PenawaranKarya, { foreignKey: 'id_user_penawar' });
PenawaranKarya.belongsTo(User, { foreignKey: 'id_user_penawar' });

// User 1 - N Notifikasi
User.hasMany(Notifikasi, { foreignKey: 'id_user_target' });
Notifikasi.belongsTo(User, { foreignKey: 'id_user_target' });

module.exports = {
  User,
  KategoriKarya,
  KaryaSeni,
  FotoKarya,
  LikeKarya,
  KomentarKarya,
  PenawaranKarya,
  Notifikasi
};
