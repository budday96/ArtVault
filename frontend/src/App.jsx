import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

// Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// Explore / Karya
import Explore from "./pages/explore/Explore.jsx";
import KaryaList from "./pages/karya/KaryaList.jsx";
import KaryaDetail from "./pages/karya/KaryaDetail.jsx";
import KaryaCreate from "./pages/karya/KaryaCreate.jsx";
import KaryaEdit from "./pages/karya/KaryaEdit.jsx";
import KaryaUploadFoto from "./pages/karya/KaryaUploadFoto.jsx";

// User
import Profil from "./pages/user/Profil.jsx";
import Notifikasi from "./pages/user/Notifikasi.jsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminKarya from "./pages/admin/AdminKarya.jsx";
import AdminUser from "./pages/admin/AdminUser.jsx";
import AdminVerifikasi from "./pages/admin/AdminVerifikasi.jsx";

// Protected Routes
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// admin kategori
import AdminKategori from "./pages/admin/AdminKategori.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Explore />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profil" element={<Profil />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
          <Route path="/karya" element={<KaryaList />} />
          <Route path="/karya/create" element={<KaryaCreate />} />
          <Route path="/karya/edit/:id" element={<KaryaEdit />} />
          <Route path="/karya/upload/:id" element={<KaryaUploadFoto />} />
          <Route path="/karya/detail/:id" element={<KaryaDetail />} />
        </Route>

        {/* ADMIN PANEL */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/karya" element={<AdminKarya />} />
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/verifikasi" element={<AdminVerifikasi />} />
          <Route path="/admin/users" element={<AdminUser />} />
          <Route path="/admin/kategori" element={<AdminKategori />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
