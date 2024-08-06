import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // Add user role state
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    console.log("Loading data...");
    setLandingPageData(JsonData);
    console.log("Data loaded: ", JsonData);
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role); // Set user role on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(""); // Reset user role on logout
    navigate("/"); // Redirect to landing page
  };

  return (
    <div>
      {!isLoggedIn && <Navigation />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isLoggedIn ? (
          <>
            {userRole === "Patient" && <Route path="/dashboard/patient" element={<PatientDashboard onLogout={handleLogout} />} />}
            {userRole === "Doctor" && <Route path="/dashboard/doctor" element={<DoctorDashboard onLogout={handleLogout} />} />}
            {userRole === "Admin" && <Route path="/dashboard/admin" element={<AdminDashboard onLogout={handleLogout} />} />}
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
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
