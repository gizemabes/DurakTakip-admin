import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [plaka, setPlaka] = useState("");
  const [duraklar, setDuraklar] = useState([]);
  const [form, setForm] = useState({
    
    kalanYolcu: "",
    kapasite: "",
    durak: "",
  });

  useEffect(() => {
    const allowedPlates = ["10ABC123", "10DEF456", "10GHI789"]; // Geçerli Balıkesir plakaları
    const storedPlaka = localStorage.getItem("plaka");
  
    if (!storedPlaka || !allowedPlates.includes(storedPlaka)) {
      alert("plaka yanlış!")
      navigate("/driver-login"); // Geçerli plaka değilse giriş sayfasına yönlendir
    } else {
      setPlaka(storedPlaka);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("plaka");
    navigate("/driver-login"); // Çıkış yaptıktan sonra login sayfasına yönlendir
  };
  
  useEffect(() => {
    fetch("http://localhost:5001/api/stops") // 📌 Backend’den durakları çek
      .then((res) => res.json())
      .then((data) => setDuraklar(data));
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.durak || !form.kalanYolcu || !form.kapasite) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const response = await fetch("http://localhost:5001/api/driver/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plaka, ...form }),
    });

    if (response.ok) {
      alert("Bilgiler başarıyla gönderildi!");
    } else {
      alert("Bir hata oluştu.");
    }
  };  
  
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Şoför Bilgi Güncelleme</h2>
      <p style={styles.subheading}><strong>Otobüs Plaka:</strong> {plaka}</p>
      <form onSubmit={handleSubmit} style={styles.form}>


 {/* durak Güncellemesi */}
      <div style={styles.optionGroup}>
          <strong>Durak Güncellemesi:</strong>
          <div style={styles.checkboxContainer}>
            {duraklar.map((durak) => (
              <div key={durak} style={styles.checkboxWrapper}>
                <input
                  type="radio"
                  id={durak._id}
                  name="durak"
                  value={durak._id}
                  onChange={handleChange}
                  
                  style={styles.checkbox}
                />
                <label htmlFor={durak} style={styles.label}>{durak.ad}</label>
               
              </div>
            ))}
          </div>
        </div>

        
        {/* Durakta Kalan Yolcu Sayısı */}
        <div style={styles.optionGroup}>
          <strong>Durakta Kalan Yolcu Sayısı:</strong>
          <div style={styles.checkboxContainer}>
            {["0" , "5" , "10", "15","20"].map((kalanYolcu) => (
              <div key={kalanYolcu} style={styles.checkboxWrapper}>
                <input
                  type="radio"
                  id={kalanYolcu}
                  name="kalanYolcu"
                  value={kalanYolcu}
                  onChange={handleChange}
                  checked={form.kalanYolcu === kalanYolcu}
                  style={styles.checkbox}
                />
                <label htmlFor={kalanYolcu} style={styles.label}>{kalanYolcu}</label>
                
              </div>
            ))}
          </div>
        </div>

        {/* Otobüs Kapasitesi */}
        <div style={styles.optionGroup}>
          <strong>Otobüs Kapasitesi:</strong>
          <div style={styles.checkboxContainer}>
            {["Boş", "Orta", "Dolu"].map((kapasite) => (
              <div key={kapasite} style={styles.checkboxWrapper}>
                <input
                  type="radio"
                  id={kapasite}
                  name="kapasite"
                  value={kapasite}
                  onChange={handleChange}
                  checked={form.kapasite === kapasite}
                  style={styles.checkbox}
                />
                <label htmlFor={kapasite} style={styles.label}>{kapasite}</label>
                
              </div>
            ))}
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>Bilgileri Kaydet</button>
        <button onClick={handleLogout} style={styles.logoutButton}>Çıkış Yap</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    backgroundColor: "rgb(241, 242, 244)",
    color: "rgb(39, 46, 55)",
    padding: "20px",
    borderRadius: "8px",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  },
  optionGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "250px",
    gap: "15px",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  label: {
    fontSize: "16px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "rgb(199, 209, 223)",
    color: "rgb(40, 46, 55)",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
  },
  submitButton: {
    padding: "12px 25px",
    marginTop: "20px",
    fontSize: "18px",
    backgroundColor: "rgb(199, 209, 223)",
    color: "rgb(40, 46, 55)",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
  },
};
