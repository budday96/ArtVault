import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function KaryaEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({});

  const loadKategori = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

  const loadDetail = async () => {
    const res = await api.get(`/karya/${id}`);
    setForm(res.data);
  };

  useEffect(() => {
    loadKategori();
    loadDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/karya/${id}`, form);
      alert("Karya berhasil diupdate!");
      nav(`/karya/detail/${id}`);

    } catch (err) {
      alert("Gagal update karya");
    }
  };

  if (!form.id_karya) return <p className="text-center mt-5">Memuat...</p>;

  return (
    <div className="container mt-4" style={{maxWidth: "700px"}}>
      <h3>Edit Karya</h3>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">

        <label className="mt-2">Judul</label>
        <input 
          className="form-control"
          value={form.judul_karya}
          onChange={(e) => setForm({...form, judul_karya: e.target.value})}
        />

        <label className="mt-2">Kategori</label>
        <select 
          className="form-control"
          value={form.id_kategori}
          onChange={(e) => setForm({...form, id_kategori: e.target.value})}
        >
          {kategori.map((k) => (
            <option key={k.id_kategori} value={k.id_kategori}>
              {k.nama_kategori}
            </option>
          ))}
        </select>

        <label className="mt-2">Tahun</label>
        <input 
          type="number"
          className="form-control"
          value={form.tahun_pembuatan}
          onChange={(e) => setForm({...form, tahun_pembuatan: e.target.value})}
        />

        <label className="mt-2">Asal</label>
        <input 
          className="form-control"
          value={form.asal_karya}
          onChange={(e) => setForm({...form, asal_karya: e.target.value})}
        />

        <label className="mt-2">Kondisi</label>
        <select 
          className="form-control"
          value={form.kondisi}
          onChange={(e) => setForm({...form, kondisi: e.target.value})}
        >
          <option>Mint</option>
          <option>Very Good</option>
          <option>Good</option>
          <option>Bad</option>
          <option>Broken</option>
        </select>

        <label className="mt-2">Kelangkaan</label>
        <select 
          className="form-control"
          value={form.kelangkaan}
          onChange={(e) => setForm({...form, kelangkaan: e.target.value})}
        >
          {[1,2,3,4,5].map((x) => <option key={x}>{x}</option>)}
        </select>

        <label className="mt-2">Estimasi Harga</label>
        <input 
          type="number"
          className="form-control"
          value={form.estimasi_harga}
          onChange={(e) => setForm({...form, estimasi_harga: e.target.value})}
        />

        <label className="mt-2">Deskripsi</label>
        <textarea 
          className="form-control" 
          rows="4"
          value={form.deskripsi}
          onChange={(e) => setForm({...form, deskripsi: e.target.value})}
        />

        <button className="btn btn-success mt-3">Update Karya</button>
      </form>
    </div>
  );
}
