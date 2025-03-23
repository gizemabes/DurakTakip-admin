import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Kullanici = {
  _id: string;
  ad: string;
  durak: { _id: string; ad: string };
  tarih: string;
  stopKisiSayisi: number;
 
};

type Driver = {
  plaka: string;
  durum: "TTM" | "Kampüs" | "Yolda";
  kalanYolcu: number;
  durak: string;
  tarih: string;
};

export default function KullaniciList() {
  const navigate = useNavigate();
  const [durakBilgileri, setDurakBilgileri] = useState<Record<string, { ad: string; stopKisiSayisi: number; enUzunBekleyen: number }>>({});
  const [soforler, setSoforler] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const simdi = Date.now();

        const [requestRes, driverRes] = await Promise.all([
          fetch("http://localhost:5001/api/requests"),
          fetch("http://localhost:5001/api/driver/list"),
        ]);

        const requestData: Kullanici[] = await requestRes.json();
        const driverData: Driver[] = await driverRes.json();

        console.log(requestData)

        const filtrelenmisKullanicilar = filterUsers(requestData, simdi);
        const filtrelenmisSoforler = filterDrivers(driverData, simdi);
        console.log(filtrelenmisKullanicilar)
        
        //const durakMap = processDurakData(filtrelenmisKullanicilar, filtrelenmisSoforler);
        
   
        setDurakBilgileri(requestData);
        setSoforler(filtrelenmisSoforler);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchData();
  }, []);

  const filterUsers = (users: Kullanici[], currentTime: number) => {
    return users.filter((user) => (currentTime - new Date(user.tarih).getTime()) / (1000 * 60) < 60);
  };

  const filterDrivers = (drivers: Driver[], currentTime: number) => {
    return drivers.filter((driver) => (currentTime - new Date(driver.tarih).getTime()) / (1000 * 60) < 60);
  };

  const processDurakData = (users: Kullanici[], drivers: Driver[]) => {
    const durakMap: Record<string, { ad: string; stopKisiSayisi: number; enUzunBekleyen: number }> = {};
    const latestDriverMap: Record<string, Driver> = {};
    const simdi = Date.now();
  
    // Kullanıcıları işleyelim
    users.forEach((user) => {
      const durakId = user.durak._id;
      const beklemeSuresi = Math.floor((simdi - new Date(user.tarih).getTime()) / (1000 * 60));  // dakika cinsinden bekleme süresi
  
      if (!durakMap[durakId]) {
        durakMap[durakId] = { ad: user.durak.ad, stopKisiSayisi: 0, enUzunBekleyen: 0 };
      }
  
      
      durakMap[durakId].stopKisiSayisi++;
      
      durakMap[durakId].enUzunBekleyen = Math.max(durakMap[durakId].enUzunBekleyen, beklemeSuresi);
    });
  
  
    drivers.sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
      .forEach((driver) => {
        latestDriverMap[driver.durak] = driver;
      });
  
 
    Object.values(latestDriverMap).forEach((driver) => {
      const durakId = Object.keys(durakMap).find((key) => durakMap[key].ad === driver.durak);
  
      if (durakId) {
        if (driver.kalanYolcu === 0) {
          // Eğer kalan yolcu 0 ise, duraktaki kişi sayısını ve bekleyen süreyi sıfırlıyoruz
          durakMap[durakId].stopKisiSayisi = 0;
          
          durakMap[durakId].enUzunBekleyen = 0;
        } else {
          // Eğer kalan yolcu sayısı 0 değilse, kişi sayısını ve bekleme süresini topluyoruz
          durakMap[durakId].stopKisiSayisi = Number(driver.stopKisiSayisi);
        }
      } else {
        durakMap[driver.durak] = { ad: driver.durak, stopKisiSayisi: driver.stopKisiSayisi, enUzunBekleyen: 0 };
      }
    });
  
    return durakMap;
  };

  const nowDate = Date.now();

  
  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate("/home")}>
        ◀ Geri Git
      </button>
      
      <div style={styles.tablesContainer}>
        <div style={styles.tableContainer}>
          <h2 style={styles.title}>BEKLEYEN YOLCULAR</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Kişi Sayısı</th>
                <th style={styles.th}>Durak Adı</th>
                <th style={styles.th}>En Uzun Bekleyen (dakika)</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(durakBilgileri).map((durak) => (
                <tr key={durak.ad}>
                  <td style={styles.td}>{durak.stopKisiSayisi}</td>
                  <td style={styles.td}>{durak.durak.ad}</td>
                  <td style={styles.td}>
                 {
                    
                   Math.floor((nowDate - new Date(durak.tarih).getTime()) / (1000 * 60))
                 }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.tableContainer}>
          <h2 style={styles.title}>OTOBÜS DURUMU</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Otobüs Plakası</th>
                <th style={styles.th}>Durak</th>
                <th style={styles.th}>Kapasite</th>
                <th style={styles.th}>Durakta Kalan Yolcu</th>
                <th style={styles.th}>Güncelleme Zamanı</th>
           
              </tr>
            </thead>
            <tbody>
              {soforler.map((sofor) => (
                <tr key={sofor.plaka}>
                  <td style={styles.td}>{sofor.plaka}</td>
                  <td style={styles.td}>{sofor.stopAd}</td> 
                  <td style={styles.td}>{sofor.kapasite}</td>
                  <td style={styles.td}>{sofor.kisiSayisi}</td>
                  <td style={styles.td}>{new Date(sofor.tarih).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</td>
                  <td style={styles.td}>
                    
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
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
  title: {
    color: "rgb(12, 36, 72)",
    textAlign: "center",
    marginBottom: "20px",
  },
  tablesContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  tableContainer: {
    flex: 1,
    minWidth: "300px",
    backgroundColor: "rgb(234, 240, 247)",
    padding: "10px",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "rgb(12, 36, 72)",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
  },
}; 
