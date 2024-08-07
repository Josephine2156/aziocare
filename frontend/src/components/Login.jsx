import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// onLogin function passed as a prop to Login component. It updates the global state to reflect that the user is logged in and sets the user role.
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // state to manage password visibility
  const navigate = useNavigate(); // useNavigate hook

  const handleChange = (e) => {
    setFormData({
      ...formData, // use spread operator to take existing property of form data and include in new object
      [e.target.name]: e.target.value, // update the property and value that triggered the event
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      alert(response.data.message); // success message
      // Handle storing user session data and redirecting based on role
      const role = response.data.role; // retrieve user role from the response
      onLogin(role); // Call onLogin with the role
      if (role === "Patient") {
        navigate("/dashboard/patient");
      } else if (role === "Doctor") {
        navigate("/dashboard/doctor");
      } else if (role === "Admin") {
        navigate("/dashboard/admin");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      if (error.response) {
        console.error("Error response:", error.response);
        alert(error.response.data.error || "Login failed"); // any validation errors, else default message
      } else {
        alert("An error occurred: " + error.message); // generic error if there's no server response
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);          // (!showPassword) inverts the current value of showPassword, initial value of showPassword is false, so when this function is triggered showPassword becomes true
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
            type={showPassword ? "text" : "password"}    //if showPassword is true, type becomes text and displays the password
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
            checked={showPassword}    //this binds the state of the checkbox the the showPassword state variable, so when box is checked, showPassword is true and vice versa
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
