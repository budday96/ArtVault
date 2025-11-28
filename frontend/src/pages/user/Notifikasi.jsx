import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Notifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [halaman, setHalaman] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadNotifikasi = async (page = 1) => {
    setLoading(true);
    const res = await api.get(`/notifikasi?halaman=${page}&limit=10`);

    setNotifikasi(res.data.data);
    setHalaman(res.data.halaman);
    setTotalHalaman(res.data.total_halaman);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifikasi(halaman);
  }, []);

  const markAsRead = async (id_notifikasi) => {
    try {
      await api.put(`/notifikasi/${id_notifikasi}/read`);
      loadNotifikasi(halaman);
    } catch (err) {
      alert("Gagal menandai notifikasi");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifikasi/read-all`);
      loadNotifikasi(halaman);
    } catch (err) {
      alert("Gagal menghapus status unread");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Notifikasi</h3>

      <button 
        className="btn btn-secondary btn-sm mt-2"
        onClick={markAllAsRead}
      >
        Tandai Semua Sudah Dibaca
      </button>

      <div className="mt-4">

        {loading ? (
          <p>Memuat notifikasi...</p>
        ) : notifikasi.length === 0 ? (
          <p className="text-muted">Tidak ada notifikasi</p>
        ) : (
          notifikasi.map((n) => (
            <div 
              key={n.id_notifikasi}
              className={`card p-3 mb-3 shadow-sm ${n.sudah_dibaca ? "" : "border-primary"}`}
            >
              <div className="d-flex justify-content-between">

                <div>
                  <h6>{n.judul}</h6>
                  <p className="text-muted">{n.pesan}</p>

                  {/* Jika ada link ke karya */}
                  {n.data_tambahan?.id_karya && (
                    <Link 
                      to={`/karya/detail/${n.data_tambahan.id_karya}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      Lihat Karya
                    </Link>
                  )}
                </div>

                {/* Button Mark as Read */}
                {!n.sudah_dibaca && (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => markAsRead(n.id_notifikasi)}
                  >
                    Read
                  </button>
                )}
              </div>

              <small className="text-muted mt-2">
                {new Date(n.dibuat_pada).toLocaleString()}
              </small>
            </div>
          ))
        )}

      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <button 
          disabled={halaman <= 1}
          className="btn btn-outline-primary"
          onClick={() => {
            setHalaman(halaman - 1);
            loadNotifikasi(halaman - 1);
          }}
        >
          Sebelumnya
        </button>

        <button 
          disabled={halaman >= totalHalaman}
          className="btn btn-outline-primary"
          onClick={() => {
            setHalaman(halaman + 1);
            loadNotifikasi(halaman + 1);
          }}
        >
          Selanjutnya
        </button>
      </div>

    </div>
  );
}
