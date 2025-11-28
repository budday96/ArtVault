import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

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

      alert("Login berhasil!");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">Masuk ke ArtVault</h3>

        <form onSubmit={handleSubmit}>
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

          <button className="btn btn-primary w-100 mt-3">Login</button>
        </form>

        <p className="text-center mt-3">
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </div>
    </div>
  );
}
