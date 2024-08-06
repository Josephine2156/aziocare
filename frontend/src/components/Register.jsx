// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    first_name: "",
    last_name: "",
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
      const response = await axios.post("/auth/register", formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error || "Registration failed");
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
      <input
        type="password"
        name="confirm_password"
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      <input type="date" name="date_of_birth" onChange={handleChange} placeholder="Date of Birth" required />
      <input type="text" name="first_name" onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="last_name" onChange={handleChange} placeholder="Last Name" required />
      <button type="submit">Register</button>
    </form>
    </div>
  );
}

export default Register;


