import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

      const role = response.data.role;
      const userId = response.data.user_id;
      const profileIncomplete = response.data.message === "Please complete your Patient Profile";
      onLogin(role, userId, profileIncomplete);

      console.log('Role:', role);
      console.log('User ID:', userId);
      console.log('Profile Incomplete:', profileIncomplete);

      if (role === "Patient" && profileIncomplete) {
        navigate(`/complete-profile/${userId}`);
      } else if (role === "Patient") {
        navigate("/dashboard/patient");
      } else if (role === "Doctor") {
        navigate("/dashboard/doctor");
      } else if (role === "Admin") {
        navigate("/dashboard/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error response:", error.response);
        alert(error.response.data.error || "Login failed");
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="checkbox"
            id="show-password"
            className="show-password-checkbox"
            checked={showPassword}
            onChange={togglePasswordVisibility}
          />
          <label htmlFor="show-password" className="show-password-label">
            Show Password
          </label>
        </div>
        <button type="submit" className="btn btn-custom btn-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
