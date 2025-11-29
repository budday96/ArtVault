import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [unread, setUnread] = useState(0);

  // ======== LOAD NOTIFIKASI UNREAD ========
  const loadUnread = async () => {
    try {
      if (!token) return; // kalau belum login, skip
      const res = await api.get("/notifikasi/unread-count");
      setUnread(res.data.unread);
    } catch (err) {
      console.log("Gagal memuat notifikasi");
    }
  };

  // Load saat navbar tampil & setiap user berpindah halaman
  useEffect(() => {
    loadUnread();
  }, [location.pathname, token]);

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">ArtVault</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li><Link className="nav-link" to="/">Explore</Link></li>

            {/* Kolektor Saja (role !== admin) */}
            {token && role !== "admin" && (
              <li><Link className="nav-link" to="/karya">Karya Saya</Link></li>
            )}

            {role === "admin" && (
              <>
                <li><Link className="nav-link" to="/admin/verifikasi">Verifikasi Karya</Link></li>
                <li><Link className="nav-link" to="/admin/users">Manajemen User</Link></li>
                <li><Link className="nav-link" to="/admin/kategori">Kategori Karya</Link></li>
                <li><Link className="nav-link" to="/admin">Dashboard Admin</Link></li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {!token ? (
              <>
                <li>
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li>
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {/* ======== NOTIFICATION ICON WITH BADGE ======== */}
                <li className="nav-item position-relative">
                  <Link className="nav-link" to="/notifikasi">
                    🔔
                    {unread > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </Link>
                </li>

                <li>
                  <Link className="nav-link" to="/profil">Profil</Link>
                </li>

                <li>
                  <button 
                    className="btn btn-danger btn-sm ms-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
