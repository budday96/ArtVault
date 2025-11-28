require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('./models');


const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ROUTES
app.use('/auth', require('./routes/auth.routes'));

// KATEGORI KARYA
app.use('/kategori', require('./routes/kategori.routes'));

// KARYA SENI
app.use('/karya', require('./routes/karya.routes'));

// FOTO KARYA
app.use('/foto', require('./routes/foto.routes'));
app.use('/uploads', express.static('uploads'));

// LIKE KARYA
app.use('/like', require('./routes/like.routes'));

// KOMENTAR KARYA
app.use('/komentar', require('./routes/komentar.routes'));

// PENAWARAN KARYA
app.use('/penawaran', require('./routes/penawaran.routes'));

// EXPLORE
app.use('/explore', require('./routes/explore.routes'));

// ADMIN
app.use('/admin', require('./routes/admin.routes'));

// NOTIFIKASI
app.use('/notifikasi', require('./routes/notifikasi.routes'));



sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.log("DB Error:", err));

app.listen(process.env.PORT, () =>
  console.log(`Server berjalan di port ${process.env.PORT}`)
);
