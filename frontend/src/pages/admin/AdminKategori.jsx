import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function AdminKategori() {
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState({ nama_kategori: "" });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/kategori/${editId}`, form);
        alert("Kategori berhasil diupdate!");
      } else {
        await api.post("/kategori", form);
        alert("Kategori berhasil ditambahkan!");
      }

      setForm({ nama_kategori: "" });
      setEditId(null);
      loadData();

    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan kategori");
    }
  };

  const handleEdit = (kat) => {
    setEditId(kat.id_kategori);
    setForm({ nama_kategori: kat.nama_kategori });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kategori ini?")) return;

    try {
      await api.delete(`/kategori/${id}`);
      alert("Kategori dihapus!");
      loadData();

    } catch (err) {
      alert("Tidak dapat menghapus kategori (mungkin sedang dipakai)");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Kelola Kategori Karya</h3>

      <div className="card p-3 mt-3">
        <form onSubmit={handleSubmit}>
          <strong>{editId ? "Edit Kategori" : "Tambah Kategori"}</strong>

          <input
            className="form-control mt-2"
            placeholder="Nama kategori"
            value={form.nama_kategori}
            onChange={(e) => setForm({ nama_kategori: e.target.value })}
          />

          <button className="btn btn-primary mt-3">
            {editId ? "Update" : "Tambah"}
          </button>

          {editId && (
            <button
              className="btn btn-secondary mt-3 ms-2"
              onClick={() => {
                setEditId(null);
                setForm({ nama_kategori: "" });
              }}
            >
              Batal
            </button>
          )}
        </form>
      </div>

      <div className="card p-3 mt-4">
        <strong>Daftar Kategori</strong>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {kategori.map((kat, i) => (
              <tr key={kat.id_kategori}>
                <td>{i + 1}</td>
                <td>{kat.nama_kategori}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(kat)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(kat.id_kategori)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
