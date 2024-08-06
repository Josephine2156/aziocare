import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      alert(response.data.message);
      // Handle storing user session data and redirecting based on role
      const role = response.data.role;
      if (role === 'Patient') {
        window.location.href = "/dashboard/patient";
      } else if (role === 'Doctor') {
        window.location.href = "/dashboard/doctor";
      } else if (role === 'Admin') {
        window.location.href = "/dashboard/admin";
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error
      if (error.response) {
        console.error("Error response:", error.response);
        alert(error.response.data.error || "Login failed");
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" name="loginForm" validate onSubmit={handleSubmit}>
        <div className="login-section-title">
          <h2>Login</h2>
          <p>Please enter your email and password to log in.</p>
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-custom btn-lg">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
