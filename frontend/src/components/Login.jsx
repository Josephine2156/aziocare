import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // useNavigate hook

  const handleChange = (e) => {
    setFormData({
      ...formData, //use spread operator to take existing property of form data and include in new object
      [e.target.name]: e.target.value, //update the property and value that triggered the event
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      alert(response.data.message); //success message
      // Handle storing user session data and redirecting based on role
      const role = response.data.role; //retrieve user role from the response
      onLogin(role); // Call onLogin with the role
      if (role === 'Patient') {
        navigate("/dashboard/patient");
      } else if (role === 'Doctor') {
        navigate("/dashboard/doctor");
      } else if (role === 'Admin') {
        navigate("/dashboard/admin");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      if (error.response) {
        console.error("Error response:", error.response);
        alert(error.response.data.error || "Login failed"); //any validation errors, else default message
      } else {
        alert("An error occurred: " + error.message); //generic error if there's no server response
      }
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" name="loginForm" validate onSubmit={handleSubmit}>
        <div className="login-section-title">
          <h2>Login</h2>
          <p>Login to access our services</p>
        </div>
        <div className="col-md-12">
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
        <div className="col-md-12">
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
};

export default Login;
