import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    setData(res.data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!data) return <p className="text-center mt-5">Memuat dashboard...</p>;

  return (
    <div className="container mt-4">
      <h3>Dashboard Admin</h3>

      <div className="row mt-4">

        <div className="col-md-3 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{data.total_karya}</h4>
            <small>Total Karya</small>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{data.total_user}</h4>
            <small>Total User</small>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{data.total_kategori}</h4>
            <small>Total Kategori</small>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{data.total_terverifikasi}</h4>
            <small>Karya Terverifikasi</small>
          </div>
        </div>

      </div>

      {/* TOP 5 */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Top 5 Karya Paling Populer</h5>

        <ul className="list-group mt-3">
          {data.top_5_populer.map((item) => (
            <li key={item.id_karya} className="list-group-item d-flex justify-content-between">
              <span>{item.judul_karya}</span>
              <span>❤️ {item.jumlah_like}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
