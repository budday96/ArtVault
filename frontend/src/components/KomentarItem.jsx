import { useState } from "react";
import api from "../api/axiosConfig";

export default function KomentarItem({ data, loadKomentar, depth = 0 }) {
  const [replyMode, setReplyMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(data.isi_komentar);

  const id_user = Number(localStorage.getItem("id_user"));
  const role = localStorage.getItem("role");

  // ---------------- REPLY ----------------
  const submitReply = async () => {
    try {
      await api.post(`/komentar/${data.id_karya}`, {
        isi_komentar: text,
        id_komentar_parent: data.id_komentar,
      });

      setReplyMode(false);
      setText("");
      loadKomentar();

    } catch (err) {
      alert("Gagal reply komentar");
    }
  };

  // ---------------- EDIT ----------------
  const submitEdit = async () => {
    try {
      await api.put(`/komentar/${data.id_komentar}`, {
        isi_komentar: text,
      });

      setEditMode(false);
      loadKomentar();
    } catch (err) {
      alert("Gagal update komentar");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!confirm("Hapus komentar ini?")) return;

    try {
      await api.delete(`/komentar/${data.id_komentar}`);
      loadKomentar();
    } catch (err) {
      alert("Tidak dapat menghapus komentar");
    }
  };

  return (
    <div className="mt-3" style={{ marginLeft: depth * 25 }}>
      <div className="border rounded p-2 bg-light shadow-sm">

        {/* Nama */}
        <strong>{data.User?.nama_lengkap || "Tidak ada nama"}</strong>

        {/* EDIT MODE */}
        {editMode ? (
          <>
            <textarea
              className="form-control mt-2"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-sm btn-success mt-2" onClick={submitEdit}>
              Simpan
            </button>
            <button className="btn btn-sm btn-secondary mt-2 ms-2"
              onClick={() => setEditMode(false)}
            >
              Batal
            </button>
          </>
        ) : (
          <p className="mt-2">{data.isi_komentar}</p>
        )}

        {/* ACTION BUTTONS */}
        {!editMode && (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                setReplyMode(!replyMode);
                setText("");
              }}
            >
              Reply
            </button>

            {(data.id_user === id_user || role === "admin") && (
              <>
                <button 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>

                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* REPLY FIELD */}
      {replyMode && (
        <div className="mt-2" style={{ marginLeft: 20 }}>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Tulis balasan..."
            onChange={(e) => setText(e.target.value)}
          />

          <button className="btn btn-sm btn-primary mt-2" onClick={submitReply}>
            Balas
          </button>

          <button 
            className="btn btn-sm btn-secondary mt-2 ms-2"
            onClick={() => setReplyMode(false)}
          >
            Batal
          </button>
        </div>
      )}

      {/* REPLIES */}
      {data.balasan && data.replies.map((balasan) => (
        <KomentarItem 
          key={balasan.id_komentar}
          data={balasan}
          loadKomentar={loadKomentar}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
