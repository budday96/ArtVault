import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function KaryaUploadFoto() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [foto, setFoto] = useState([]);

  const loadFoto = async () => {
    try {
      const res = await api.get(`/karya/${id}`);
      setFoto(res.data.foto_karya || []);
    } catch (err) {
      console.log("Gagal load foto", err);
    }
  };

  useEffect(() => {
    loadFoto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let f of files) {
        formData.append("foto", f);
      }

      await api.post(`/foto/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Upload foto berhasil!");
      setFiles([]);
      loadFoto();

    } catch (err) {
      console.log(err);
      alert("Gagal upload foto");
    }
  };

  const hapusFoto = async (id_foto) => {
    if (!confirm("Yakin hapus foto?")) return;

    try {
      await api.delete(`/foto/${id_foto}`);
      loadFoto();
    } catch (err) {
      alert("Gagal hapus foto");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3>Upload Foto Karya</h3>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">

        <input
          type="file"
          multiple
          className="form-control"
          onChange={(e) => setFiles(e.target.files)}
        />

        {/* Preview */}
        <div className="row mt-3">
          {Array.from(files).map((file, i) => (
            <div key={i} className="col-md-4 col-6 mb-2">
              <img
                src={URL.createObjectURL(file)}
                className="img-fluid rounded"
                alt="preview"
              />
            </div>
          ))}
        </div>

        <button className="btn btn-primary mt-3">Upload Foto</button>
      </form>

      <div className="card p-3 mt-4 shadow-sm">
        <h5>Foto Sudah Diupload</h5>

        <div className="row mt-2">
          {foto.map((f) => (
            <div key={f.id_foto} className="col-md-3 col-6 mb-3 text-center">
              <img
                src={`http://localhost:5000/uploads/karya/${f.nama_file}`}
                className="img-fluid rounded"
                alt="foto"
              />

              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => hapusFoto(f.id_foto)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
