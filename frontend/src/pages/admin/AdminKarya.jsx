import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function AdminKarya() {
  const [karya, setKarya] = useState([]);

  const loadData = async () => {
    const res = await api.get("/admin/karya");
    setKarya(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Semua Karya</h3>

      <div className="row mt-3">
        {karya.map((k) => (
          <div className="col-md-4 mb-4" key={k.id_karya}>
            <div className="card p-3 shadow-sm">

              <h5>{k.judul_karya}</h5>
              <small>{k.kategori_karya?.nama_kategori}</small>

              <p>Status: {k.status_publikasi}</p>

              <Link 
                to={`/karya/detail/${k.id_karya}`}
                className="btn btn-primary btn-sm mt-2"
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
