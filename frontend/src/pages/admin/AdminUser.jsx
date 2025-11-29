import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function AdminUser() {
  const [users, setUsers] = useState([]);

  const loadData = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const ban = async (id) => {
    if (!confirm("Ban user ini?")) return;
    await api.put(`/admin/user/ban/${id}`);
    alert("User dibanned & karyanya diarsipkan.");
    loadData();
  };

  const unban = async (id) => {
    if (!confirm("Aktifkan user ini kembali?")) return;
    await api.put(`/admin/user/unban/${id}`);
    alert("User diaktifkan kembali.");
    loadData();
  };

  return (
    <div className="container mt-4">
      <h3>Manajemen User</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status Akun</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id_user}>
              <td>{u.nama_lengkap}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <span className={`badge ${u.status_akun === "aktif" ? "bg-success" : "bg-danger"}`}>
                  {u.status_akun}
                </span>
              </td>
              <td>
                {u.status_akun === "aktif" ? (
                  <button className="btn btn-danger btn-sm" onClick={() => ban(u.id_user)}>
                    Ban
                  </button>
                ) : (
                  <button className="btn btn-success btn-sm" onClick={() => unban(u.id_user)}>
                    Unban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
