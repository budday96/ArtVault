import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import noImage from "../../assets/no-image.png";
import "../../assets/css/explore.css";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";


export default function Explore() {
  const [karya, setKarya] = useState([]);
  const [kategori, setKategori] = useState([]);

  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState("terbaru");
  const [filterKategori, setFilterKategori] = useState("");
  const [kelangkaan, setKelangkaan] = useState("");
  const [hargaMin, setHargaMin] = useState("");
  const [hargaMax, setHargaMax] = useState("");
  const [search, setSearch] = useState("");

  const [halaman, setHalaman] = useState(1);
  const [totalHalaman, setTotalHalaman] = useState(1);

  const loadKategori = async () => {
    const res = await api.get("/kategori");
    setKategori(res.data);
  };

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
      if (reset) setKarya(res.data.data);
      else setKarya((prev) => [...prev, ...res.data.data]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKategori();
    loadKarya(true);
  }, []);

  useEffect(() => {
    setHalaman(1);
    loadKarya(true);
  }, [sort, filterKategori, kelangkaan, hargaMin, hargaMax]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHalaman(1);
      loadKarya(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadMore = () => {
    if (halaman < totalHalaman) {
      setHalaman(halaman + 1);
      loadKarya();
    }
  };

  const toggleLike = async (id_karya) => {
    try {
      await api.post(`/like/${id_karya}`);
      setHalaman(1);
      loadKarya(true);
    } catch {
      alert("Gagal like");
    }
  };

  // Convert skor menjadi tampilan bintang
  const renderStars = (score) => {
    const stars = [];
    const maxStars = 5;
    const rating = Math.round(score); // jika mau pakai half-star, bilang ya

    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#FFA500" />);  // bintang penuh
      } else {
        stars.push(<FaRegStar key={i} color="#FFA500" />); // bintang kosong
      }
    }

    return stars;
  };


  return (
    <div className="explore-store-wrapper">

      <div className="explore-filter-section mb-4">
        <input
          type="text"
          className="form-control explore-search-input"
          placeholder="Cari karya..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="form-select explore-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="terbaru">Terbaru</option>
          <option value="skor">Skor Tertinggi</option>
          <option value="penawaran">Penawaran Tertinggi</option>
          <option value="populer">Paling Populer</option>
          <option value="trending">Trending</option>
        </select>
        <select className="form-select explore-select" value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
          <option value="">Semua Kategori</option>
          {kategori.map((k) => (
            <option key={k.id_kategori} value={k.id_kategori}>
              {k.nama_kategori}
            </option>
          ))}
        </select>
      </div>

      <div className="explore-grid-store">
        {karya.map((k) => {
          const cover = k.FotoKaryas?.find((f) => f.is_cover === 1) || k.FotoKaryas?.[0];
          const url = cover ? `http://localhost:5000${cover.path_file}` : noImage;

          return (
            <div className="explore-item-card" key={k.id_karya}>
              <div className="explore-item-img-wrapper">
                <img src={url} alt="karya" className="explore-item-img" />
              </div>
              <div className="explore-item-body">
                <h4 className="explore-item-title">{k.judul_karya}</h4>
                <p className="explore-item-category">{k.kategori_karya?.nama_kategori}</p>
                {/* contoh jika ada harga atau skor */}
                <div className="explore-item-stars">
                  {renderStars(k.skor_nilai)}
                </div>
              </div>
              <div className="explore-item-actions">
                <Link to={`/karya/detail/${k.id_karya}`} className="btn-shop">
                  Detail
                </Link>
                <button className="btn-like-store" onClick={() => toggleLike(k.id_karya)}>
                  {k.sudah_like ? <FaHeart color="red" /> : <FaRegHeart />} {k.jumlah_like}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {halaman < totalHalaman && (
        <div className="text-center my-5">
          <button className="btn btn-load-more" onClick={loadMore}>
            {loading ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}

    </div>
  );
}
