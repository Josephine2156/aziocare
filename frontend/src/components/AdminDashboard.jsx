import React from "react";

const AdminDashboard = ({ onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      <button onClick={onLogout}>Logout</button>
      {/* Add your admin dashboard features here */}
    </div>
  );
};

export default AdminDashboard;
