import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fake Admin Kullanıcı Kontrolü (Gerçek backend API bağlanacak)
    if (username === "admin" && password === "1234") {
        localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/home");
    } else {
      alert("Hatalı giriş!");
    }
  };
  const handleSwitchToDriver = () => {
    navigate("/driver-login"); // Switch to driver login page
  };

  return (
    <div style={styles.container}>
      <h2>Admin Girişi</h2>
      
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Giriş Yap</button>
     {/* Button to switch to driver login */}
     <button onClick={handleSwitchToDriver} style={styles.button}>
        Şoför Girişi
      </button>
    </div>
  );
}
const styles = {
    container: {
      color:"rgb(221, 226, 233)",
      display: "flex",
      fontSize: "25px",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "rgb(20, 23, 29)",
    },
    input: {
      width: "250px",
      color:"rgb(50, 55, 62)",
      padding: "10px",
      margin: "10px",
      fontSize: "16px",
      border:"radius",
      borderRadius:"6px",
      backgroundColor:"rgb(198, 209, 224)",
    },
    button: {
      padding: "10px 20px",
      marginTop:"20px",
      fontSize: "18px",
      backgroundColor: "rgb(199, 209, 223)",
      color: "rgb(40, 46, 55)",
      border: "none",
      cursor: "pointer",
      borderRadius:"4px",
    },
  };
