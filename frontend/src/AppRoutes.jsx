import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import PatientDashboard from "./components/Patient/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CompletePatientProfile from "./components/Patient/CompletePatientProfile";

const AppRoutes = ({ landingPageData, isLoggedIn, userRole, handleLogin, userId, profileIncomplete, profileComplete }) => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      {isLoggedIn ? (
        <>
          {userRole === "Patient" && profileIncomplete && (
            <Route 
              path="/complete-profile/:userId" 
              element={<CompletePatientProfile profileComplete={profileComplete} />} 
            />
          )}
          {userRole === "Patient" && !profileIncomplete && (
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
          )}
          {userRole === "Doctor" && (
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          )}
          {userRole === "Admin" && (
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          )}
          <Route path="*" element={<Navigate to={userRole === "Patient" && profileIncomplete ? `/complete-profile/${userId}` : `/dashboard/${userRole.toLowerCase()}`} />} />
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
