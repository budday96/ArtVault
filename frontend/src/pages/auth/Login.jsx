import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../assets/css/auth.css";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("nama", res.data.user.nama_lengkap);

      alert("Login berhasil");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal. Periksa kembali data Anda.");
    }
  };

  return (
    <div className="auth-page-container">

      <div className="auth-box">

        <h1 className="auth-title-medusa">Selamat Datang Kembali</h1>
        <p className="auth-desc-medusa">
          Masuk untuk melanjutkan dan menikmati layanan ArtVault.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* EMAIL */}
          <div className="auth-input-group">
            <input
              type="email"
              required
              className="auth-input-medusa"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label className="auth-input-label">Email</label>
          </div>

          {/* PASSWORD */}
          <div className="auth-input-group">
            <input
              type="password"
              required
              className="auth-input-medusa"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <label className="auth-input-label">Password</label>
          </div>

          {/* BUTTON */}
          <button className="auth-btn-medusa" type="submit">
            Masuk
          </button>
        </form>

        <p className="auth-bottom-text-medusa">
          Belum punya akun?{" "}
          <a href="/register" className="auth-link-medusa">
            Buat akun baru
          </a>
        </p>

      </div>

    </div>
  );
}
