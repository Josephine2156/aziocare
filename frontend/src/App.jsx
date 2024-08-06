import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { Features } from "./components/Features";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    console.log("Loading data...");
    setLandingPageData(JsonData);
    console.log("Data loaded: ", JsonData);
  }, []);

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <>
                <Header data={landingPageData.Header} />
                <Features data={landingPageData.Features} />
                <About data={landingPageData.About} />
                <Services data={landingPageData.Services} />
                <Gallery data={landingPageData.Gallery} />
                <Testimonials data={landingPageData.Testimonials} />
                <Team data={landingPageData.Team} />
                <Contact data={landingPageData.Contact} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
