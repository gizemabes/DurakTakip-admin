import { Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import DurakList from "./components/DurakList";
import KullaniciList from "./components/KullaniciList";
import AdminHome from "./components/AdminHome";
import Driver from "./components/Driver";
import DriverLogin from "./components/DriverLogin"; // Add the DriverLogin component

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/home" element={<AdminHome />} />
      <Route path="/duraklar" element={<DurakList />} />
      <Route path="/kullanicilar" element={<KullaniciList />} />
      <Route path="/driver" element={<Driver />} />
      <Route path="/driver-login" element={<DriverLogin />} /> {/* Route for driver login */}
    </Routes>
  );
}

export default App;
