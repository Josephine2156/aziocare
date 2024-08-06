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
      const response = await axios.post("http://localhost:5000/auth/login", formData);
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
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
