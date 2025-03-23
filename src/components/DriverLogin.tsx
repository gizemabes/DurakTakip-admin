import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const [plaka, setPlaka] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (plaka.trim() !== "") {
      localStorage.setItem("plaka", plaka);
      navigate("/driver"); // Redirect to Driver Home page (this should be your driver home)
    } else {
      alert("Lütfen geçerli bir plaka girin!");
    }
  };
  const handleSwitchToDriver = () => {
    navigate("/"); // Switch to driver login page
  };

  return (
    <div style={styles.container}>
      <h2>Şoför Girişi</h2>
      <input
        type="text"
        placeholder="Otobüs Plakanızı Girin"
        value={plaka}
        onChange={(e) => setPlaka(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>
        Giriş Yap
      </button>
      <button onClick={handleSwitchToDriver} style={styles.button}>
        Admin Girişi
      </button>
    </div>
  );
}

const styles = {
  container: {
    color: "rgb(221, 226, 233)",
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
    color: "rgb(50, 55, 62)",
    padding: "10px",
    margin: "10px",
    fontSize: "16px",
    border: "radius",
    borderRadius: "6px",
    backgroundColor: "rgb(198, 209, 224)",
  },
  button: {
    padding: "10px 20px",
    marginTop: "20px",
    fontSize: "18px",
    backgroundColor: "rgb(199, 209, 223)",
    color: "rgb(40, 46, 55)",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
