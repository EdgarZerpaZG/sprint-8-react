import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UsersPage from "../pages/Users";
import Map from "../pages/Map";
import Calendar from "../pages/Calendar";
import Graphics from "../pages/Graphics";

export default function PagesRoutes(){
    return(
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/map" element={<Map />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/graphics" element={<Graphics />} />
            </Routes>
        </>
    )
}