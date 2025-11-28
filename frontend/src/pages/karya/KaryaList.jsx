import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link } from "react-router-dom";

export default function KaryaList() {
  const [karya, setKarya] = useState([]);

  const loadData = async () => {
    const res = await api.get("/karya/me");
    setKarya(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Karya Saya</h3>
        <Link className="btn btn-primary" to="/karya/create">+ Tambah Karya</Link>
      </div>

      <div className="row">
        {karya.map((k) => (
          <div className="col-md-4 mb-4" key={k.id_karya}>
            <div className="card shadow-sm p-3">
              <h5>{k.judul_karya}</h5>
              <small className="text-muted">{k.kategori_karya?.nama_kategori}</small>

              <div className="mt-2">
                <span className={`badge bg-${
                  k.status_publikasi === "Publish" ? "success" :
                  k.status_publikasi === "Draft" ? "secondary" :
                  "warning"
                }`}>
                  {k.status_publikasi}
                </span>
              </div>

              <div className="mt-3 d-flex gap-2">
                <Link className="btn btn-sm btn-primary" to={`/karya/detail/${k.id_karya}`}>
                  Detail
                </Link>
                <Link className="btn btn-sm btn-warning" to={`/karya/edit/${k.id_karya}`}>
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
