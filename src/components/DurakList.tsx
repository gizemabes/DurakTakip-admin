import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Durak = {
  _id: string;
  ad: string;
  qrKod: string;
};

export default function DurakList() {
  const navigate = useNavigate();
  const [duraklar, setDuraklar] = useState<Durak[]>([]);
  const [yeniDurak, setYeniDurak] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/stops") // 📌 Backend’den durakları çek
      .then((res) => res.json())
      .then((data) => setDuraklar(data));
  }, []);

  const handleEkle = async () => {
    if (!yeniDurak) {
      alert("Lütfen durak adı girin!");
      return;
    }

    const res = await fetch("http://localhost:5001/api/stops/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad: yeniDurak }),
    });

    if (res.ok) {
      const yeniEklenenDurak = await res.json();
      setDuraklar([...duraklar, yeniEklenenDurak.yeniDurak]);
      setYeniDurak("");
    } else {
      alert("Durak eklenirken hata oluştu!");
    }
  };

  const handleSil = async (id: string) => {
    await fetch(`http://localhost:5001/api/stops/${id}`, { method: "DELETE" });
    setDuraklar(duraklar.filter((durak) => durak._id !== id));
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/home")}>
        ◀ Geri Git
      </button>
      <h2 style={styles.title}>DURAKLARIN LİSTESİ</h2>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Durak Adı"
          value={yeniDurak}
          onChange={(e) => setYeniDurak(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleEkle} style={styles.button}>
          Ekle
        </button>
      </div>

      <div style={styles.grid}>
        {duraklar.map((durak) => (
          <div key={durak._id} style={styles.card}>
            <h3>{durak.ad}</h3>
            <img src={durak.qrKod} alt="QR Kod" style={styles.qrKod} />
            <button onClick={() => handleSil(durak._id)} style={styles.deleteButton}>
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", marginBottom: "20px", color: "rgb(20, 29, 42)" },
  form: { display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" },
  input: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", flex: "1" },
  button: { padding: "8px 16px", borderRadius: "4px", backgroundColor: "rgb(20, 29, 42)", color: "white", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  backButton: {
    backgroundColor: "rgb(20, 29, 42)",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    marginBottom: "20px",
  },
  card: { backgroundColor: "rgb(44, 63, 77)", padding: "15px", borderRadius: "8px", textAlign: "center", color: "white" },
  qrKod: { width: "100px", height: "100px", marginTop: "10px", margin: "20px" },
  deleteButton: { marginTop: "10px", padding: "8px 12px", borderRadius: "2px", backgroundColor: "rgb(9, 22, 40)", color: "white", cursor: "pointer" },
};
