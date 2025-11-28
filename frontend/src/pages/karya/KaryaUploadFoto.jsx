import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function KaryaUploadFoto() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [fotoKarya, setFotoKarya] = useState([]);

  const loadFoto = async () => {
    const res = await api.get(`/karya/${id}`);
    setFotoKarya(res.data.foto_karya || []);
  };

  useEffect(() => {
    loadFoto();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let file of files) {
      formData.append("foto", file);
    }

    try {
      await api.post(`/karya/${id}/upload-foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Foto berhasil diupload!");
      setFiles([]);
      loadFoto();

    } catch (err) {
      alert("Gagal upload foto");
    }
  };

  const deleteFoto = async (id_foto) => {
    if (!confirm("Yakin hapus foto?")) return;

    try {
      await api.delete(`/karya/foto/${id_foto}`);
      loadFoto();
    } catch (err) {
      alert("Gagal menghapus foto");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3>Upload Foto Karya</h3>

      {/* Form Upload */}
      <form onSubmit={handleUpload} className="card p-4 mt-3 shadow-sm">

        <input 
          type="file"
          className="form-control"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        {/* PREVIEW SEBELUM UPLOAD */}
        <div className="row mt-3">
          {Array.from(files).map((file, i) => (
            <div className="col-md-4 col-6 mb-3" key={i}>
              <img 
                src={URL.createObjectURL(file)}
                className="img-fluid rounded"
              />
            </div>
          ))}
        </div>

        <button className="btn btn-primary mt-3">Upload Foto</button>
      </form>

      {/* FOTO YANG SUDAH DIUPLOAD */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Foto Sudah Diupload</h5>

        <div className="row mt-3">
          {fotoKarya.map((f) => (
            <div key={f.id_foto} className="col-md-3 col-6 mb-3 text-center">
              <img 
                src={`http://localhost:5000/uploads/karya/${f.nama_file}`}
                className="img-fluid rounded"
              />
              <button 
                className="btn btn-danger btn-sm mt-2"
                onClick={() => deleteFoto(f.id_foto)}
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
