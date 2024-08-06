import React, { useState } from "react";
import axios from "axios";

const initialState = {
  email: "",
  password: "",
  confirm_password: "",
  date_of_birth: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  role: "Patient", // Default role
};

function Register() {
  const [
    {
      email,
      password,
      confirm_password,
      date_of_birth,
      first_name,
      last_name,
      phone_number,
      role,
    },
    setState,
  ] = useState(initialState);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value })); //update state with new value for corresponding fields,  using prevState so each state update is based on the latest state
  };

  const clearState = () => setState({ ...initialState }); //function to clear state

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent default reloading page behaviour 
    try {
      const response = await axios.post("/auth/register", {
        email,
        password,
        confirm_password,
        date_of_birth,
        first_name,
        last_name,
        phone_number,
        role,
      }); //make post request to endpoint with form data
      console.log("API response:", response);
      alert(response.data.message); //success message 
      clearState(); //reset form field to initial state 
    } catch (error) {
      console.error("Error:", error); // Log the entire error object
      if (error.response) {
        console.error("Error response:", error.response); //any server error 
        if (error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join("\n"); //any validation errrors
          alert("Validation errors:\n" + errorMessages);
        } else {
          alert(error.response.data.error || "Registration failed"); //general error message if there are no validation errors
        }
      } else {
        alert("An error occurred: " + error.message); //general error message if no server response 
      }
    }
  };

  return (
    <div className="register-form-container">
      <form className="register-form" name="registerForm" validate onSubmit={handleSubmit}>
        <div className="register-section-title">
          <h2>Register</h2>
          <p>Create your account to access our services</p>
        </div>
        <div className="form-group">
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-control"
            placeholder="First Name"
            required
            value={first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-control"
            placeholder="Last Name"
            required
            value={last_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Email"
            required
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            className="form-control"
            placeholder="Date of Birth"
            required
            value={date_of_birth}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            className="form-control"
            placeholder="Phone Number"
            required
            value={phone_number}
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
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            className="form-control"
            placeholder="Confirm Password"
            required
            value={confirm_password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <select
            id="role"
            name="role"
            className="form-control"
            value={role}
            onChange={handleChange}
            required
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-custom btn-lg">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
