import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PatientProfile = () => {
  const { patient_id } = useParams();  // Get the patient_id from the URL parameters
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the patient profile
    axios.get(`/patient/patient_profile/${patient_id}`)
      .then(response => {
        setPatientProfile(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.response ? error.response.data.error : 'An error occurred while fetching the patient profile.');
        setLoading(false);
      });
  }, [patient_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
        <div className='dashboard-content'>
      <h2>Patient Profile</h2>
      <p><strong>First Name:</strong> {patientProfile.first_name}</p>
      <p><strong>Last Name:</strong> {patientProfile.last_name}</p>
      <p><strong>Date of Birth:</strong> {patientProfile.date_of_birth}</p>
      <p><strong>Email:</strong> {patientProfile.email}</p>
      <p><strong>Phone:</strong> {patientProfile.phone}</p>
      <p><strong>NHI Number:</strong> {patientProfile.nhi_number}</p>
    </div>
    </div>
  );
};

export default PatientProfile;
