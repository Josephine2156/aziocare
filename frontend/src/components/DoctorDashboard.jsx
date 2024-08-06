import React from "react";

const DoctorDashboard = ({ onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Doctor Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      {/* Add your doctor dashboard features here */}
    </div>
  );
};

export default DoctorDashboard;
