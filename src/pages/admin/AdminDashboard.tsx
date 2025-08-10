import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-charcoal rounded-3xl shadow-xl border border-light-gray/10 text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Welcome to Polly, Admin!</h1>
      <p className="text-dark-text/70">
        This is your central hub for managing users, polls, and votes.
      </p>
    </div>
  );
};

export default AdminDashboard
