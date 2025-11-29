import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link } from "react-router-dom";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [karya, setKarya] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    nama_lengkap: "",
    bio: ""
  });

  const loadProfil = async () => {
    try {
      const resUser = await api.get("/auth/profile");
      setUser(resUser.data);

      setForm({
        nama_lengkap: resUser.data.nama_lengkap,
        bio: resUser.data.bio || ""
      });

      const resKarya = await api.get("/karya/me");
      setKarya(resKarya.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProfil();
  }, []);

  if (!user) return <p className="text-center mt-5">Memuat profil...</p>;

  const totalKarya = karya.length;
  const totalSkor = karya.reduce((sum, k) => sum + Number(k.skor_nilai || 0), 0);

  const level =
    totalSkor > 200 ? "Master Collector" :
    totalSkor > 100 ? "Pro Collector" :
    "Beginner Collector";

  const saveProfile = async () => {
    try {
      await api.put("/auth/update", form);
      alert("Profil berhasil diperbarui");
      setEditMode(false);
      loadProfil();
    } catch (err) {
      alert("Gagal update profil");
    }
  };

  return (
    <div className="container mt-4">

      <div className="card p-4 shadow-sm">
        <div className="d-flex">
          <div className="me-4">
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#ddd",
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                fontWeight: "bold"
              }}
            >
              {user.nama_lengkap.charAt(0)}
            </div>
          </div>

          <div className="flex-grow-1">

            {editMode ? (
              <>
                <input
                  className="form-control mb-2"
                  value={form.nama_lengkap}
                  onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
                />

                <textarea
                  className="form-control mb-2"
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />

                <button className="btn btn-success btn-sm" onClick={saveProfile}>Simpan</button>
                <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditMode(false)}>Batal</button>
              </>
            ) : (
              <>
                <h3>{user.nama_lengkap}</h3>
                <p className="text-muted">{user.bio || "Belum ada bio"}</p>

                <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>
                  Edit Profil
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>{totalKarya}</h4>
            <p>Total Karya</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h4>{totalSkor}</h4>
            <p>Total Skor Nilai</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center shadow-sm">
            <h5>{level}</h5>
            <p>Level Kolektor</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Badge Kolektor</h5>

        <div className="d-flex gap-3 mt-2 flex-wrap">

          {totalSkor > 200 && <div className="badge bg-warning text-dark p-2">⭐ Master Collector</div>}
          {totalSkor > 100 && <div className="badge bg-info text-dark p-2">🔥 Pro Collector</div>}
          {totalSkor <= 100 && <div className="badge bg-secondary p-2">🎨 Beginner</div>}
        
        </div>
      </div>

      {/* Aksi */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Aksi Cepat</h5>
        <div className="d-flex gap-3 mt-3 flex-wrap">
          <Link className="btn btn-outline-primary" to="/karya">Lihat Karya Saya</Link>
          <Link className="btn btn-outline-secondary" to="/notifikasi">Notifikasi</Link>
          <Link className="btn btn-outline-success" to="/karya/create">Tambah Karya Baru</Link>
        </div>
      </div>
    </div>
  );
}
