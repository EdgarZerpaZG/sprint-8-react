import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Calendar from "./pages/Calendar";
import Graphics from "./pages/Graphics";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/graphics" element={<Graphics />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
