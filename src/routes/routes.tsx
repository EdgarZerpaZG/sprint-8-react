import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UsersPage from "../pages/Users";
import Map from "../pages/Map";
import Calendar from "../pages/Calendar";
import Graphics from "../pages/Graphics";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EmailConfirmation from "../pages/EmailConfirmation";
import Profile from "../pages/Profile";
import AdminUsers from "../pages/AdminUsers";
import AdminRoute from "./AdminRoute";

export default function PagesRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/map" element={<Map />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/graphics" element={<Graphics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emailconfirmation" element={<EmailConfirmation />} />
        <Route path="/profile" element={<Profile />} />

        {/* admin */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}