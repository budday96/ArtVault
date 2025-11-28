import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import noImage from "../../assets/no-image.png";


export default function Explore() {
  const [karya, setKarya] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [loading, setLoading] = useState(false);

  // FILTER & SORT PARAMS
  const [sort, setSort] = useState("terbaru");
  const [filterKategori, setFilterKategori] = useState("");
  const [kelangkaan, setKelangkaan] = useState("");
  const [hargaMin, setHargaMin] = useState("");
  const [hargaMax, setHargaMax] = useState("");
  const [search, setSearch] = useState("");

  // PAGINATION
  const [halaman, setHalaman] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(1);

  // LOAD KATEGORI
  const loadKategori = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

  // LOAD KARYA
  const loadKarya = async (reset = false) => {
    try {
      setLoading(true);

      const res = await api.get("/explore", {
        params: {
          sort,
          kategori: filterKategori,
          kelangkaan,
          harga_min: hargaMin,
          harga_max: hargaMax,
          cari: search,
          halaman
        }
      });

      setTotalHalaman(res.data.total_halaman);

      if (reset) {
        // overwrite data
        setKarya(res.data.data);
      } else {
        // append data
        setKarya((prev) => [...prev, ...res.data.data]);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadKategori();
    loadKarya(true);
  }, []);

  // APPLY FILTER & SORT (reset page)
  useEffect(() => {
    setHalaman(1);
    loadKarya(true);
  }, [sort, filterKategori, kelangkaan, hargaMin, hargaMax]);

  // SEARCH DELAY
  useEffect(() => {
    const timer = setTimeout(() => {
      setHalaman(1);
      loadKarya(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // LOAD MORE
  const loadMore = () => {
    if (halaman < totalHalaman) {
      setHalaman(halaman + 1);
      loadKarya();
    }
  };

  // LIKE - UNLIKE
  const toggleLike = async (id_karya) => {
    try {
      await api.post(`/like/${id_karya}`);
      setHalaman(1);
      loadKarya(true);
    } catch (err) {
      alert("Gagal like");
    }
  };

  return (
    <div className="container mt-4">

      <h3>Explore Karya Seni</h3>

      {/* FILTER & SORT */}
      <div className="card p-3 shadow-sm mt-3">

        <div className="row g-3">

          {/* SEARCH */}
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Cari nama karya..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* SORT */}
          <div className="col-md-3">
            <select className="form-control"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="terbaru">Terbaru</option>
              <option value="skor">Skor Tertinggi</option>
              <option value="penawaran">Penawaran Tertinggi</option>
              <option value="populer">Paling Populer</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          {/* KATEGORI */}
          <div className="col-md-3">
            <select className="form-control"
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategori.map((k) => (
                <option key={k.id_kategori} value={k.id_kategori}>
                  {k.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {/* KELANGKAAN */}
          <div className="col-md-2">
            <select className="form-control"
              value={kelangkaan}
              onChange={(e) => setKelangkaan(e.target.value)}
            >
              <option value="">Kelangkaan</option>
              {[1,2,3,4,5].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>

        </div>

        {/* HARGA */}
        <div className="row g-3 mt-3">
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Harga Min"
              onChange={(e) => setHargaMin(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Harga Max"
              onChange={(e) => setHargaMax(e.target.value)}
            />
          </div>
        </div>

      </div>

      {/* LIST KARYA */}
      <div className="row mt-4">
        {karya.map((k) => {
          const url =
            k.foto_karya?.length > 0
              ? `http://localhost:5000/uploads/karya/${k.foto_karya[0].nama_file}`
              : noImage;

          return (
            <div className="col-md-3 mb-4" key={k.id_karya}>
              <div className="card p-2 shadow-sm">

                <img
                  src={url}
                  alt="karya"
                  className="img-fluid rounded"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />

                <h6 className="mt-2">{k.judul_karya}</h6>
                <small className="text-muted">
                  {k.kategori_karya?.nama_kategori}
                </small>

                {/* SCORE */}
                <p className="mt-2 mb-1">
                  <small>Skor: {k.skor_nilai}</small>
                </p>

                {/* LIKE + DETAIL */}
                <div className="d-flex justify-content-between mt-2">
                  <Link
                    to={`/karya/detail/${k.id_karya}`}
                    className="btn btn-primary btn-sm"
                  >
                    Detail
                  </Link>

                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => toggleLike(k.id_karya)}
                  >
                    {k.sudah_like ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}{" "}
                    {k.jumlah_like}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {halaman < totalHalaman && (
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-primary" onClick={loadMore}>
            {loading ? "Memuat..." : "Load More"}
          </button>
        </div>
      )}

      {loading && <p className="text-center mt-3">Memuat karya...</p>}
    </div>
  );
}
