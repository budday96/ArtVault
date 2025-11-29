import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

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
      alert("Registrasi berhasil! Silakan login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal registrasi");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">Daftar Akun Baru</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nama Lengkap</label>
            <input 
              type="text"
              className="form-control"
              placeholder="Masukkan nama lengkap"
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Username</label>
            <input 
              type="text"
              className="form-control"
              placeholder="Masukkan username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>


          <div className="mb-3">
            <label>Email</label>
            <input 
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input 
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="btn btn-success w-100 mt-3">Daftar</button>
        </form>

        <p className="text-center mt-3">
          Sudah punya akun? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
