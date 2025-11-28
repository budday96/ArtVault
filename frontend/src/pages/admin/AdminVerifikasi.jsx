import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function AdminVerifikasi() {
  const [karya, setKarya] = useState([]);
  const [alasan, setAlasan] = useState("");

  const loadData = async () => {
    const res = await api.get("/admin/karya");
    setKarya(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const verifikasi = async (id) => {
    await api.put(`/admin/karya/verifikasi/${id}`);
    alert("Karya telah diverifikasi.");
    loadData();
  };

  const tolak = async (id) => {
    const alasanPenolakan = prompt("Masukkan alasan penolakan:");
    if (!alasanPenolakan) return;

    await api.put(`/admin/karya/tolak/${id}`, {
      alasan: alasanPenolakan
    });

    alert("Karya ditolak.");
    loadData();
  };

  const hapus = async (id) => {
    if (!confirm("Yakin ingin menghapus karya ini?")) return;

    await api.delete(`/admin/karya/hapus/${id}`);
    alert("Karya berhasil dihapus.");
    loadData();
  };

  return (
    <div className="container mt-4">
      <h3>Verifikasi Karya Seni</h3>

      <div className="row mt-3">
        {karya.map((k) => (
          <div className="col-md-4 mb-4" key={k.id_karya}>
            <div className="card p-3 shadow-sm">

              <h5>{k.judul_karya}</h5>
              <small className="text-muted">{k.kategori_karya?.nama_kategori}</small>
              <p>Status: {k.status_publikasi}</p>

              {/* ACTIONS */}
              <div className="d-flex gap-2 mt-3">

                <Link 
                  to={`/karya/detail/${k.id_karya}`}
                  className="btn btn-primary btn-sm"
                >
                  Detail
                </Link>

                {/* Verifikasi */}
                {k.status_publikasi !== "Publish" && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => verifikasi(k.id_karya)}
                  >
                    Verifikasi
                  </button>
                )}

                {/* Tolak */}
                {k.status_publikasi !== "Arsip" && (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => tolak(k.id_karya)}
                  >
                    Tolak
                  </button>
                )}

                {/* Hapus */}
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => hapus(k.id_karya)}
                >
                  Hapus
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
