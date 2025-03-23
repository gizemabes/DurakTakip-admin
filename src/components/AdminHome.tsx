import { Link } from "react-router-dom";
import { BusFront } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function AdminHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer giriş yapılmamışsa, login sayfasına yönlendir
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
      navigate("/"); // AdminLogin sayfasına yönlendir
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/"); // Çıkış yaptıktan sonra login sayfasına yönlendir
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1>DURAK TAKİP</h1>
        <div style={styles.menu}>
          <Link to="/duraklar" style={styles.link}>Durak Listesi</Link>
          <Link to="/kullanicilar" style={styles.link}>Yolcu-Durak Listesi</Link>
          
          <button onClick={handleLogout} style={styles.logoutButton}>Çıkış Yap</button>
        </div>
      </nav>
      <div style={styles.content}>
        <BusFront size={47} color="rgb(71, 87, 115)" />
        <h2>Yönetici Panelinize Hoş geldiniz!</h2>
        <p>Artık duraklardaki yolcu sayılarını takip etmen daha kolay.</p>
        
        {/* Çıkış Butonu */}
  
      </div>
    </div>
  );
}

// 📌 CSS Stilleri (Sayfanın içinde)
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",  // İçeriği ve sidebar'ı yan yana koyar
    height: "100vh",  // Sayfanın tamamını kapla
    width: "100vw",   // Tüm genişliği kapla
    margin: "0",      // Varsayılan boşlukları kaldır
    padding: "0",
    overflow: "hidden", 
    backgroundColor: "rgb(217, 225, 239)",
  },
  navbar: {
    width: "300px",  // Sidebar genişliği
    height: "100vh",  // Sayfanın tamamını kaplasın
    backgroundColor: "rgb(25, 30, 37)",
    color: "rgb(179, 193, 217)",
    display: "flex",
    flexDirection: "column", // Linkleri dikey hizalar
    alignItems: "center",
    gap: "30px",
  },
  link: {
    borderRadius: "2px",
    backgroundColor: "rgb(170, 191, 221)",
    color: "rgb(33, 41, 52)",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "10px",
    width: "100%",
    textAlign: "center" as const,
    display: "block",
    marginBottom:"20px",
  },
  content: {
    flex: 1, // Navbar sabit kalırken içeriğin genişlemesini sağlar
    padding: "250px",
  },
  logoutButton: {
    marginTop: "400px",
    padding: "10px 20px",
    backgroundColor: "rgb(171, 190, 218)",
    color: "rgb(40, 46, 55)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};