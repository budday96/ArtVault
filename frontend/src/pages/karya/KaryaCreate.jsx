import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function KaryaCreate() {
  const nav = useNavigate();

  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({
    judul_karya: "",
    id_kategori: "",
    tahun_pembuatan: "",
    asal_karya: "",
    kondisi: "Good",
    kelangkaan: 1,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/karya", form);

      alert("Karya berhasil dibuat!");
      nav(`/karya/upload/${res.data.id_karya}`);

    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah karya");
    }
  };

  return (
    <div className="container mt-4" style={{maxWidth: "700px"}}>
      <h3>Tambah Karya Baru</h3>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">

        <label className="mt-2">Judul Karya</label>
        <input className="form-control" 
          onChange={(e) => setForm({...form, judul_karya: e.target.value})}
        />

        <label className="mt-2">Kategori</label>
        <select className="form-control"
          onChange={(e) => setForm({...form, id_kategori: e.target.value})}
        >
          <option value="">-- Pilih Kategori --</option>
          {kategori.map((k) => (
            <option key={k.id_kategori} value={k.id_kategori}>
              {k.nama_kategori}
            </option>
          ))}
        </select>

        <label className="mt-2">Tahun Pembuatan</label>
        <input type="number" className="form-control"
          onChange={(e) => setForm({...form, tahun_pembuatan: e.target.value})}
        />

        <label className="mt-2">Asal Karya</label>
        <input className="form-control"
          onChange={(e) => setForm({...form, asal_karya: e.target.value})}
        />

        <label className="mt-2">Kondisi</label>
        <select className="form-control"
          onChange={(e) => setForm({...form, kondisi: e.target.value})}
        >
          <option>Mint</option>
          <option>Very Good</option>
          <option>Good</option>
          <option>Bad</option>
          <option>Broken</option>
        </select>

        <label className="mt-2">Kelangkaan</label>
        <select className="form-control"
          onChange={(e) => setForm({...form, kelangkaan: e.target.value})}
        >
          {[1,2,3,4,5].map((x) => <option key={x}>{x}</option>)}
        </select>

        <label className="mt-2">Estimasi Harga</label>
        <input type="number" className="form-control"
          onChange={(e) => setForm({...form, estimasi_harga: e.target.value})}
        />

        <label className="mt-2">Deskripsi</label>
        <textarea 
          className="form-control" 
          rows="4"
          onChange={(e) => setForm({...form, deskripsi: e.target.value})}
        />

        <button className="btn btn-primary mt-4">
          Simpan & Upload Foto →
        </button>

      </form>
    </div>
  );
}
