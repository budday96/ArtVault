import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function KaryaCreate() {
  const nav = useNavigate();

  const [kategori, setKategori] = useState([]);

  const [form, setForm] = useState({
    judul_karya: "",
    id_kategori: "",
    pembuat: "",
    tahun_pembuatan: "",
    nilai_historis: "",
    kelangkaan: 1,
    kondisi: "Baik",
    estimasi_harga: "",
    deskripsi: ""
  });

  const loadKategori = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

  useEffect(() => {
    loadKategori();
  }, []);

  // ================= SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/karya", form);

      alert("Karya berhasil dibuat!");

      const idKarya = res.data?.data?.id_karya;
      nav(`/karya/upload/${idKarya}`);

    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah karya!");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3>Tambah Karya Baru</h3>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">

        {/* JUDUL */}
        <label className="mt-2">Judul Karya</label>
        <input
          className="form-control"
          value={form.judul_karya}
          onChange={(e) => setForm({ ...form, judul_karya: e.target.value })}
        />

        {/* KATEGORI */}
        <label className="mt-2">Kategori</label>
        <select
          className="form-control"
          value={form.id_kategori}
          onChange={(e) =>
            setForm({ ...form, id_kategori: e.target.value })
          }
        >
          <option value="">-- Pilih Kategori --</option>
          {kategori.map((k) => (
            <option key={k.id_kategori} value={k.id_kategori}>
              {k.nama_kategori}
            </option>
          ))}
        </select>

        {/* PEMBUAT */}
        <label className="mt-2">Pembuat</label>
        <input
          className="form-control"
          value={form.pembuat}
          onChange={(e) => setForm({ ...form, pembuat: e.target.value })}
        />

        {/* TAHUN */}
        <label className="mt-2">Tahun Pembuatan</label>
        <input
          type="number"
          className="form-control"
          value={form.tahun_pembuatan}
          onChange={(e) =>
            setForm({ ...form, tahun_pembuatan: e.target.value })
          }
        />

        {/* NILAI HISTORIS */}
        <label className="mt-2">Nilai Historis (1 - 5)</label>
        <select
          className="form-control"
          value={form.nilai_historis}
          onChange={(e) =>
            setForm({ ...form, nilai_historis: e.target.value })
          }
        >
          <option value="">-- Pilih --</option>
          {[1, 2, 3, 4, 5].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>

        {/* KONDISI */}
        <label className="mt-2">Kondisi</label>
        <select
          className="form-control"
          value={form.kondisi}
          onChange={(e) => setForm({ ...form, kondisi: e.target.value })}
        >
          <option>Sangat Baik</option>
          <option>Baik</option>
          <option>Sedang</option>
          <option>Buruk</option>
          <option>Rusak</option>
        </select>

        {/* KELANGKAAN */}
        <label className="mt-2">Kelangkaan</label>
        <select
          className="form-control"
          value={form.kelangkaan}
          onChange={(e) => setForm({ ...form, kelangkaan: e.target.value })}
        >
          {[1, 2, 3, 4, 5].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>

        {/* HARGA */}
        <label className="mt-2">Estimasi Harga</label>
        <input
          type="number"
          className="form-control"
          value={form.estimasi_harga}
          onChange={(e) =>
            setForm({ ...form, estimasi_harga: e.target.value })
          }
        />

        {/* DESKRIPSI */}
        <label className="mt-2">Deskripsi</label>
        <textarea
          className="form-control"
          rows="4"
          value={form.deskripsi}
          onChange={(e) =>
            setForm({ ...form, deskripsi: e.target.value })
          }
        />

        <button className="btn btn-primary mt-4">
          Simpan & Upload Foto →
        </button>
      </form>
    </div>
  );
}
