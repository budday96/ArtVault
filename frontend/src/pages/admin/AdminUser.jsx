import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function AdminUser() {
  const [user, setUser] = useState([]);

  const loadUser = async () => {
    const res = await api.get("/admin/user-list");
    setUser(res.data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const banUser = async (id_user) => {
    await api.put(`/admin/user/ban/${id_user}`);
    loadUser();
  };

  const unbanUser = async (id_user) => {
    await api.put(`/admin/user/unban/${id_user}`);
    loadUser();
  };

  return (
    <div className="container mt-4">
      <h3>Kelola User</h3>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {user.map((u, i) => (
            <tr key={u.id_user}>
              <td>{i + 1}</td>
              <td>{u.nama_lengkap}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge bg-${
                  u.status_akun === "aktif" ? "success" : "danger"
                }`}>
                  {u.status_akun}
                </span>
              </td>

              <td>
                {u.status_akun === "aktif" ? (
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => banUser(u.id_user)}
                  >
                    Ban
                  </button>
                ) : (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => unbanUser(u.id_user)}
                  >
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
