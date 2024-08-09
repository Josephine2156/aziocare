import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Navigation from "./components/Navigation";
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
  const [userId, setUserId] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    console.log("Loading data...");
    setLandingPageData(JsonData);
    console.log("Data loaded: ", JsonData);
  }, []);

  const handleLogin = (role, userId, profileIncomplete) => {
    setIsLoggedIn(true);
    setUserRole(role); // Set user role on login
    setUserId(userId);
    setProfileIncomplete(profileIncomplete);
  };

  const handleLogout = (navigate) => {
    setIsLoggedIn(false);
    setUserRole(""); // Reset user role on logout
    navigate("/"); // Redirect to landing page
  };

  return (
    <Router>
      <div>
        <Navigation isLoggedIn={isLoggedIn} userRole={userRole} handleLogout={handleLogout} />
        <AppRoutes
          landingPageData={landingPageData}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          userId={userId}
          profileIncomplete={profileIncomplete}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </div>
    </Router>
  );
};

export default App;
