import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import KomentarItem from "../../components/KomentarItem.jsx";

export default function KaryaDetail() {
  const { id } = useParams();
  const [karya, setKarya] = useState(null);
  const [foto, setFoto] = useState([]);
  const [liked, setLiked] = useState(false);
  const [jumlahLike, setJumlahLike] = useState(0);

  // Komentar state
  const [komentar, setKomentar] = useState([]);
  const [isiKomentar, setIsiKomentar] = useState("");

  // Penawaran state (bid)
  const [penawaran, setPenawaran] = useState([]);
  const [nilaiPenawaran, setNilaiPenawaran] = useState("");
  const [penawaranTertinggi, setPenawaranTertinggi] = useState(0);
  const id_user = Number(localStorage.getItem("id_user"));


  // Load komentar
  const loadKomentar = async () => {
    const res = await api.get(`/komentar/${id}`)
    setKomentar(res.data);
  };

   // Load penawaran
  const loadPenawaran = async () => {
    const res = await api.get(`/penawaran/karya/${id}`);
    setPenawaran(res.data);
    setPenawaranTertinggi(res.data.length > 0 ? res.data[0].nilai_penawaran : 0);
  };

  // Initial load
  useEffect(() => {
    loadDetail();
    loadKomentar();
    loadPenawaran();
  }, [id]);

  // Initial load
  useEffect(() => {
    loadDetail();
    loadKomentar();
  }, [id]);


  // Load detail karya
  const loadDetail = async () => {
    const res = await api.get(`/karya/${id}`);
    setKarya(res.data);
    setFoto(res.data.foto_karya || []);
    setLiked(res.data.sudah_like);
    setJumlahLike(res.data.jumlah_like);
  };

  useEffect(() => {
    loadDetail();
  }, [id]);



    const toggleLike = async () => {
    try {
        const res = await api.post(`/like/${id}`);

        setLiked(res.data.liked);
        setJumlahLike(res.data.jumlah_like);

    } catch (err) {
        alert("Gagal melakukan like");
    }
    };


  if (!karya) return <p className="text-center mt-5">Memuat detail...</p>;

  return (
    <div className="container mt-4">
      <h3>{karya.judul_karya}</h3>
      <p className="text-muted">{karya.kategori_karya?.nama_kategori}</p>

      {/* Foto Gallery */}
      <div className="row mt-4">
        {foto.length > 0 ? (
          foto.map((f) => (
            <div key={f.id_foto} className="col-md-3 col-6 mb-3">
              <img 
                src={`http://localhost:5000/uploads/karya/${f.nama_file}`}
                alt="karya"
                className="img-fluid rounded shadow"
              />
            </div>
          ))
        ) : (
          <p>Belum ada foto diupload</p>
        )}
      </div>

      {/* Informasi Karya */}
      <div className="card p-3 shadow-sm mt-3">
        <p><strong>Kondisi:</strong> {karya.kondisi}</p>
        <p><strong>Kelangkaan:</strong> {karya.kelangkaan}</p>
        <p><strong>Estimasi Harga:</strong> Rp {Number(karya.estimasi_harga).toLocaleString()}</p>
        <p><strong>Skor Nilai:</strong> {karya.skor_nilai}</p>
        <p><strong>Status:</strong> {karya.status_publikasi}</p>
        <p className="mt-3"><strong>Deskripsi:</strong><br />{karya.deskripsi}</p>
      </div>

      {/* LIKE BUTTON */}
        <div className="mt-3">
            <button
                className={`btn ${liked ? "btn-danger" : "btn-outline-danger"}`}
                onClick={toggleLike}
            >
                {liked ? "❤️ Unlike" : "🤍 Like"} ({jumlahLike})
            </button>
        </div>


      {/* Placeholder: Komentar + Penawaran akan diisi di modul berikut */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Komentar</h5>
        <p>Modul Komentar akan ditambahkan di tahap berikutnya.</p>
      </div>

      <div className="card p-3 mt-4 shadow-sm">
        <h5>Penawaran (Bid)</h5>
        <p>Modul Bid akan ditambahkan di tahap berikutnya.</p>
      </div>

      {/* KOMENTAR SECTION */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Komentar ({komentar.length})</h5>

        {/* form komentar utama */}
        <textarea 
          className="form-control mt-2"
          rows="3"
          placeholder="Tulis komentar..."
          value={isiKomentar}
          onChange={(e) => setIsiKomentar(e.target.value)}
        />

        <button 
          className="btn btn-primary mt-2"
          onClick={async () => {
            try {
              await api.post(`/komentar/${id}`, {
                isi_komentar: isiKomentar
              });
              setIsiKomentar("");
              loadKomentar();
            } catch (err) {
              alert("Gagal menambah komentar");
            }
          }}
        >
          Kirim Komentar
        </button>

        {/* LIST KOMENTAR */}
        <div className="mt-4">
          {komentar.length === 0 ? (
            <p className="text-muted">Belum ada komentar</p>
          ) : (
            komentar.map((k) => (
              <KomentarItem 
                key={k.id_komentar}
                data={k}
                loadKomentar={loadKomentar}
              />
            ))
          )}
        </div>
      </div>

      {/* PENAWARAN SECTION */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Penawaran Harga (Bid)</h5>

        <p>
          Penawaran tertinggi saat ini: 
          <strong> Rp {Number(penawaranTertinggi).toLocaleString()}</strong>
        </p>

        {karya.id_user === id_user ? (
          <p className="text-muted">
            Anda adalah pemilik karya, sehingga tidak dapat memberikan penawaran.
          </p>
        ) : (
          <>
            <div className="input-group mt-3">
              <span className="input-group-text">Rp</span>
              <input 
                type="number"
                className="form-control"
                placeholder="Masukkan nilai penawaran"
                value={nilaiPenawaran}
                onChange={(e) => setNilaiPenawaran(e.target.value)}
              />
              <button 
                className="btn btn-success"
                onClick={async () => {
                  try {
                    await api.post(`/penawaran/${id}`, {
                      nilai_penawaran: Number(nilaiPenawaran)
                    });

                    setNilaiPenawaran("");
                    loadPenawaran();
                    loadDetail();

                  } catch (err) {
                    alert(err.response?.data?.message || "Penawaran gagal");
                  }
                }}
              >
                Ajukan
              </button>
            </div>
          </>
        )}
      </div>

      {/* LIST PENAWARAN */}
      <div className="card p-3 mt-4 shadow-sm">
        <h5>Riwayat Penawaran</h5>

        {penawaran.length === 0 ? (
          <p className="text-muted">Belum ada penawaran</p>
        ) : (
          <ul className="list-group mt-3">
            {penawaran.map((p, i) => (
              <li key={p.id_penawaran} className="list-group-item d-flex justify-content-between">
                <span>
                  <strong>Rp {Number(p.nilai_penawaran).toLocaleString()}</strong>
                  <br />
                  <small className="text-muted">
                    oleh {p.user.nama_lengkap}
                  </small>
                </span>

                <span className="text-muted">
                  {new Date(p.dibuat_pada).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>


    </div>
  );
}
