-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Nov 2025 pada 10.21
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artvault_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `foto_karya`
--

CREATE TABLE `foto_karya` (
  `id_foto` bigint(20) UNSIGNED NOT NULL,
  `id_karya` bigint(20) UNSIGNED NOT NULL,
  `path_file` varchar(255) NOT NULL,
  `urutan` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_cover` tinyint(1) NOT NULL DEFAULT 0,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `foto_karya`
--

INSERT INTO `foto_karya` (`id_foto`, `id_karya`, `path_file`, `urutan`, `is_cover`, `dibuat_pada`) VALUES
(1, 1, '/uploads/karya/1763884211516-412396331.jpg', 0, 1, '2025-11-23 07:50:11'),
(2, 1, '/uploads/karya/1763884211525-306030557.jpg', 1, 0, '2025-11-23 07:50:11'),
(3, 1, '/uploads/karya/1763884211526-132018807.jpg', 2, 0, '2025-11-23 07:50:11'),
(4, 1, '/uploads/karya/1763884211540-727520089.jpg', 3, 0, '2025-11-23 07:50:11'),
(5, 1, '/uploads/karya/1763884211542-198915441.jpg', 4, 0, '2025-11-23 07:50:11'),
(6, 2, '/uploads/karya/1763887015248-227658299.jpg', 0, 0, '2025-11-23 08:36:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `karya_seni`
--

CREATE TABLE `karya_seni` (
  `id_karya` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_kategori` int(10) UNSIGNED NOT NULL,
  `judul_karya` varchar(150) NOT NULL,
  `pembuat` varchar(150) DEFAULT NULL,
  `tahun_pembuatan` int(11) DEFAULT NULL,
  `nilai_historis` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `kelangkaan` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `kondisi` enum('Sangat Baik','Baik','Sedang','Buruk','Rusak') NOT NULL DEFAULT 'Baik',
  `estimasi_harga` decimal(15,2) DEFAULT NULL,
  `skor_nilai` decimal(6,2) NOT NULL DEFAULT 0.00,
  `popularitas` decimal(8,2) NOT NULL DEFAULT 0.00,
  `deskripsi` text DEFAULT NULL,
  `status_publikasi` enum('Draft','Publish','Arsip') NOT NULL DEFAULT 'Draft',
  `jumlah_like` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `jumlah_komentar` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `penawaran_tertinggi` decimal(15,2) DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diupdate_pada` datetime DEFAULT NULL,
  `dihapus_pada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `karya_seni`
--

INSERT INTO `karya_seni` (`id_karya`, `id_user`, `id_kategori`, `judul_karya`, `pembuat`, `tahun_pembuatan`, `nilai_historis`, `kelangkaan`, `kondisi`, `estimasi_harga`, `skor_nilai`, `popularitas`, `deskripsi`, `status_publikasi`, `jumlah_like`, `jumlah_komentar`, `penawaran_tertinggi`, `dibuat_pada`, `diupdate_pada`, `dihapus_pada`) VALUES
(1, 1, 1, 'Lukisan Senja 1', 'Adi Nugroho', 1998, 4, 5, 'Sangat Baik', 15000000.00, 4.80, 0.00, 'Lukisan langka era modern', 'Publish', 2, 3, 150000000.00, '2025-11-23 07:12:28', '2025-11-23 07:32:17', NULL),
(2, 3, 1, 'Lukisan Senja syahrul', 'Adi Nugroho syahrul', 1988, 3, 2, 'Sangat Baik', 10000000.00, 3.10, 0.00, 'Lukisan langka era modern', 'Arsip', 0, 0, NULL, '2025-11-23 08:35:42', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_karya`
--

CREATE TABLE `kategori_karya` (
  `id_kategori` int(10) UNSIGNED NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `urutan` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `aktif` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `kategori_karya`
--

INSERT INTO `kategori_karya` (`id_kategori`, `nama_kategori`, `slug`, `deskripsi`, `urutan`, `aktif`) VALUES
(1, 'Lukisan Modern', 'lukisan-modern', 'Lukisan era modern', 2, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `komentar_karya`
--

CREATE TABLE `komentar_karya` (
  `id_komentar` bigint(20) UNSIGNED NOT NULL,
  `id_karya` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_komentar_parent` bigint(20) UNSIGNED DEFAULT NULL,
  `isi_komentar` text NOT NULL,
  `status_komentar` enum('normal','dilaporkan','dihapus') NOT NULL DEFAULT 'normal',
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diupdate_pada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `komentar_karya`
--

INSERT INTO `komentar_karya` (`id_komentar`, `id_karya`, `id_user`, `id_komentar_parent`, `isi_komentar`, `status_komentar`, `dibuat_pada`, `diupdate_pada`) VALUES
(1, 1, 1, NULL, 'Saya revisi sedikit pendapat saya.', 'normal', '2025-11-23 08:07:46', '2025-11-23 08:12:36'),
(2, 1, 1, 1, 'Betul, detail warnanya keren', 'normal', '2025-11-23 08:09:18', NULL),
(3, 1, 3, NULL, 'Karya ini Bagus Sekali kawan!', 'normal', '2025-11-23 09:07:47', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `like_karya`
--

CREATE TABLE `like_karya` (
  `id_like` bigint(20) UNSIGNED NOT NULL,
  `id_karya` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `like_karya`
--

INSERT INTO `like_karya` (`id_like`, `id_karya`, `id_user`, `dibuat_pada`) VALUES
(3, 1, 1, '2025-11-23 08:00:53'),
(4, 1, 3, '2025-11-23 09:06:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasi`
--

CREATE TABLE `notifikasi` (
  `id_notifikasi` bigint(20) UNSIGNED NOT NULL,
  `id_user_target` bigint(20) UNSIGNED NOT NULL,
  `tipe_notifikasi` varchar(50) NOT NULL,
  `judul` varchar(150) NOT NULL,
  `pesan` text NOT NULL,
  `data_tambahan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_tambahan`)),
  `sudah_dibaca` tinyint(1) NOT NULL DEFAULT 0,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `notifikasi`
--

INSERT INTO `notifikasi` (`id_notifikasi`, `id_user_target`, `tipe_notifikasi`, `judul`, `pesan`, `data_tambahan`, `sudah_dibaca`, `dibuat_pada`) VALUES
(1, 1, 'like', 'Karyamu mendapat like baru', 'Seorang pengguna menyukai karya \"Lukisan Senja 1\"', '{\"id_karya\":1}', 0, '2025-11-23 09:06:21'),
(2, 1, 'komentar', 'Karyamu dikomentari', 'Ada komentar baru pada karya \"Lukisan Senja 1\"', '{\"id_karya\":1}', 0, '2025-11-23 09:07:47'),
(3, 1, 'penawaran', 'Karyamu mendapat penawaran baru', 'Ada penawaran baru sebesar 150000000 pada karya \"Lukisan Senja 1\"', '{\"id_karya\":1,\"nilai_penawaran\":150000000}', 0, '2025-11-23 09:09:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penawaran_karya`
--

CREATE TABLE `penawaran_karya` (
  `id_penawaran` bigint(20) UNSIGNED NOT NULL,
  `id_karya` bigint(20) UNSIGNED NOT NULL,
  `id_user_penawar` bigint(20) UNSIGNED NOT NULL,
  `nilai_penawaran` decimal(15,2) NOT NULL,
  `status_penawaran` enum('aktif','diterima','ditolak','dibatalkan') NOT NULL DEFAULT 'aktif',
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `penawaran_karya`
--

INSERT INTO `penawaran_karya` (`id_penawaran`, `id_karya`, `id_user_penawar`, `nilai_penawaran`, `status_penawaran`, `dibuat_pada`) VALUES
(1, 1, 3, 25000000.00, 'aktif', '2025-11-23 08:18:37'),
(2, 1, 3, 35000000.00, 'aktif', '2025-11-23 08:18:56'),
(3, 1, 3, 45000000.00, 'aktif', '2025-11-23 08:19:42'),
(4, 1, 3, 150000000.00, 'aktif', '2025-11-23 09:09:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','kolektor') NOT NULL DEFAULT 'kolektor',
  `foto_profil` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `level_kolektor` enum('beginner','pro','master') DEFAULT 'beginner',
  `total_skor_koleksi` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status_akun` enum('aktif','dibanned') NOT NULL DEFAULT 'aktif',
  `tanggal_daftar` datetime NOT NULL DEFAULT current_timestamp(),
  `terakhir_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama_lengkap`, `username`, `email`, `password_hash`, `role`, `foto_profil`, `bio`, `level_kolektor`, `total_skor_koleksi`, `status_akun`, `tanggal_daftar`, `terakhir_login`) VALUES
(1, 'Budi Agung', 'budi', 'budi@mail.com', '$2b$10$myGMVHftX3oiOkeL/lXdOunT689hpgzkBat3YyVKiXmUCDYlrJheO', 'kolektor', NULL, NULL, 'beginner', 0.00, 'aktif', '2025-11-23 06:50:11', NULL),
(2, 'Yoga Saputra', 'yoga', 'yoga@mail.com', '$2b$10$W1IyDN.f//H51bNYsRlu5uvsrfNMIFWlutCGXAlwIT0KFiroPdqNK', 'admin', NULL, NULL, 'beginner', 0.00, 'aktif', '2025-11-23 06:53:21', NULL),
(3, 'syah irul', 'syahrul', 'syahrul@mail.com', '$2b$10$G7YTNBXm6RL2VZ8p1D7ouuLViFuvr4MfzV7201BxbP.RmzTxPfGKG', 'kolektor', NULL, NULL, 'beginner', 0.00, 'aktif', '2025-11-23 08:16:57', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `foto_karya`
--
ALTER TABLE `foto_karya`
  ADD PRIMARY KEY (`id_foto`),
  ADD KEY `idx_foto_karya` (`id_karya`);

--
-- Indeks untuk tabel `karya_seni`
--
ALTER TABLE `karya_seni`
  ADD PRIMARY KEY (`id_karya`),
  ADD KEY `fk_karya_user` (`id_user`),
  ADD KEY `idx_karya_kategori` (`id_kategori`),
  ADD KEY `idx_karya_publikasi` (`status_publikasi`),
  ADD KEY `idx_karya_skor` (`skor_nilai`),
  ADD KEY `idx_karya_penawaran` (`penawaran_tertinggi`);

--
-- Indeks untuk tabel `kategori_karya`
--
ALTER TABLE `kategori_karya`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `komentar_karya`
--
ALTER TABLE `komentar_karya`
  ADD PRIMARY KEY (`id_komentar`),
  ADD KEY `fk_komentar_parent` (`id_komentar_parent`),
  ADD KEY `idx_komentar_karya` (`id_karya`),
  ADD KEY `idx_komentar_user` (`id_user`);

--
-- Indeks untuk tabel `like_karya`
--
ALTER TABLE `like_karya`
  ADD PRIMARY KEY (`id_like`),
  ADD UNIQUE KEY `uniq_like` (`id_karya`,`id_user`),
  ADD KEY `idx_like_karya` (`id_karya`),
  ADD KEY `idx_like_user` (`id_user`);

--
-- Indeks untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`id_notifikasi`),
  ADD KEY `idx_notif_user` (`id_user_target`),
  ADD KEY `idx_notif_baca` (`sudah_dibaca`);

--
-- Indeks untuk tabel `penawaran_karya`
--
ALTER TABLE `penawaran_karya`
  ADD PRIMARY KEY (`id_penawaran`),
  ADD KEY `fk_penawaran_user` (`id_user_penawar`),
  ADD KEY `idx_penawaran_karya` (`id_karya`),
  ADD KEY `idx_penawaran_karya_nilai` (`id_karya`,`nilai_penawaran`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `foto_karya`
--
ALTER TABLE `foto_karya`
  MODIFY `id_foto` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `karya_seni`
--
ALTER TABLE `karya_seni`
  MODIFY `id_karya` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kategori_karya`
--
ALTER TABLE `kategori_karya`
  MODIFY `id_kategori` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `komentar_karya`
--
ALTER TABLE `komentar_karya`
  MODIFY `id_komentar` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `like_karya`
--
ALTER TABLE `like_karya`
  MODIFY `id_like` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  MODIFY `id_notifikasi` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `penawaran_karya`
--
ALTER TABLE `penawaran_karya`
  MODIFY `id_penawaran` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `foto_karya`
--
ALTER TABLE `foto_karya`
  ADD CONSTRAINT `fk_foto_karya` FOREIGN KEY (`id_karya`) REFERENCES `karya_seni` (`id_karya`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `karya_seni`
--
ALTER TABLE `karya_seni`
  ADD CONSTRAINT `fk_karya_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_karya` (`id_kategori`),
  ADD CONSTRAINT `fk_karya_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `komentar_karya`
--
ALTER TABLE `komentar_karya`
  ADD CONSTRAINT `fk_komentar_karya` FOREIGN KEY (`id_karya`) REFERENCES `karya_seni` (`id_karya`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_komentar_parent` FOREIGN KEY (`id_komentar_parent`) REFERENCES `komentar_karya` (`id_komentar`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_komentar_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `like_karya`
--
ALTER TABLE `like_karya`
  ADD CONSTRAINT `fk_like_karya` FOREIGN KEY (`id_karya`) REFERENCES `karya_seni` (`id_karya`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD CONSTRAINT `fk_notifikasi_user` FOREIGN KEY (`id_user_target`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `penawaran_karya`
--
ALTER TABLE `penawaran_karya`
  ADD CONSTRAINT `fk_penawaran_karya` FOREIGN KEY (`id_karya`) REFERENCES `karya_seni` (`id_karya`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_penawaran_user` FOREIGN KEY (`id_user_penawar`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
