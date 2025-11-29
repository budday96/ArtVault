import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "../../assets/css/auth.css";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registrasi berhasil. Silakan masuk.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal registrasi");
    }
  };

  return (
    <div className="auth-page-container">

      <div className="auth-box">

        <h1 className="auth-title-medusa">Buat Akun Baru</h1>
        <p className="auth-desc-medusa">
          Bergabung dan jadilah bagian dari komunitas ArtVault.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* NAMA LENGKAP */}
          <div className="auth-input-group">
            <input
              type="text"
              required
              className="auth-input-medusa"
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            />
            <label className="auth-input-label">Nama Lengkap</label>
          </div>

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
            Daftar
          </button>
        </form>

        <p className="auth-bottom-text-medusa">
          Sudah punya akun?{" "}
          <a href="/login" className="auth-link-medusa">
            Masuk di sini
          </a>
        </p>

      </div>

    </div>
  );
}
