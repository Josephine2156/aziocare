import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CompletePatientProfile = ({ profileComplete }) => {
    const [formData, setFormData] = useState({
        phone: '',
        nhi_number: '',
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: ''
    });
    const navigate = useNavigate();
    const { userId } = useParams();  // Get the userId from the route parameters

    // Fetch user data when the component mounts
    useEffect(() => {
        axios.get(`/auth/patient/complete/${userId}`)
            .then(response => {
                const userData = response.data;
                setFormData({
                    ...formData,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    date_of_birth: userData.date_of_birth
                });
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                alert("There was an error fetching user data.");
            });
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/auth/patient/complete/${userId}`, {
            phone: formData.phone,
            nhi_number: formData.nhi_number
        })
            .then(response => {
                alert(response.data.message); // Success message 
                profileComplete(); // Update profileIncomplete state
                navigate('/dashboard/patient'); // Redirect to the patient dashboard
            })
            .catch(error => {
                console.error("Error:", error); // Log the entire error object
                if (error.response) {
                    console.error("Error response:", error.response); // any server error 
                    if (error.response.data.errors) {
                        const errorMessages = Object.values(error.response.data.errors).flat().join("\n"); // any validation errors
                        alert(errorMessages);
                    } else {
                        alert(error.response.data.error || "There was an error in completing the Patient Profile. Please try again."); // general error message if there are no validation errors
                    }
                } else {
                    alert("An error occurred: " + error.message); // general error message if no server response 
                }
            });
    };

    return (
        <div className="dashboard">

        
            <form className="dashboard-form" name="completeProfileForm" onSubmit={handleSubmit}>
                <div className="dashboard-form-title">
                    <h2>Patient Profile</h2>
                    <p>Please complete your patient profile to gain full access to all features.</p>
                </div>
                
                <div className="form-group col-md-6">
                    <label for="first_name">Legal First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="form-control"
                        placeholder="First Name"
                        value={formData.first_name}
                        readOnly
                    />
                </div>

                <div className="form-group col-md-6">
                <label for="last_name">Legal Surname</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className="form-control"
                        placeholder="Last Name"
                        value={formData.last_name}
                        readOnly
                    />
                </div>

                <div className="form-group col-md-6">
                <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        readOnly
                    />
                </div>

                <div className="form-group col-md-6">
                <label for="date_of_birth">Date of Birth</label>
                    <input
                        type="text"
                        id="text"
                        name="date_of_birth"
                        className="form-control"
                        placeholder="Date of Birth"
                        value={formData.date_of_birth}
                        readOnly
                    />
                </div>

                <div className="form-group col-md-6">
                <label for="phone">Phone number</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group col-md-6">
                <label for="nhi_number">NHI Number</label>
                    
                    <input
                        type="text"
                        id="nhi_number"
                        name="nhi_number"
                        className="form-control"
                        placeholder="NHI Number"
                        value={formData.nhi_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-custom btn-lg">
                    Submit
                </button>
            </form>
        </div>
     
    );
};

export default CompletePatientProfile;
