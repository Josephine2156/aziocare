import React from "react";

const PatientDashboard = ({ onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Patient Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      {/* Add your patient dashboard features here */}
    </div>
  );
};

export default PatientDashboard;
