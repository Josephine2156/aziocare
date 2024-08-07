import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";

const AppRoutes = ({ landingPageData, isLoggedIn, userRole, handleLogin, handleLogout }) => {
  const navigate = useNavigate(); // useNavigate hook

  const logoutAndNavigate = () => {
    handleLogout(navigate);
  };

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      {isLoggedIn ? (
        <>
          {userRole === "Patient" && (
            <Route path="/dashboard/patient" element={<PatientDashboard onLogout={logoutAndNavigate} />} />
          )}
          {userRole === "Doctor" && (
            <Route path="/dashboard/doctor" element={<DoctorDashboard onLogout={logoutAndNavigate} />} />
          )}
          {userRole === "Admin" && (
            <Route path="/dashboard/admin" element={<AdminDashboard onLogout={logoutAndNavigate} />} />
          )}
          <Route path="*" element={<Navigate to={`/dashboard/${userRole.toLowerCase()}`} />} />
        </>
      ) : (
        <Route
          path="/"
          element={
            <>
              <Header data={landingPageData.Header} />
              <About data={landingPageData.About} />
              <Services data={landingPageData.Services} />
              <Gallery data={landingPageData.Gallery} />
              <Testimonials data={landingPageData.Testimonials} />
              <Team data={landingPageData.Team} />
              <Contact data={landingPageData.Contact} />
            </>
          }
        />
      )}
    </Routes>
  );
};

export default AppRoutes;
