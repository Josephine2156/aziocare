import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CompletePatientProfile = () => {
    const [formData, setFormData] = useState({
        phone: '',
        nhi_number: ''
    });
    const navigate = useNavigate();
    const { userId } = useParams();  // Get the userId from the route parameters

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/patient/complete/${userId}`, formData)
            .then(response => {
                navigate(`/patient-profile/${response.data.patient_id}`);
            })
            .catch(error => {
                console.error("There was an error completing the patient profile!", error);
            });
    };

    return (
    <div className="dashboard">
      <div className="dashboard-content">
            <h1>Complete Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    NHI Number:
                    <input type="text" name="nhi_number" value={formData.nhi_number} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default CompletePatientProfile;
