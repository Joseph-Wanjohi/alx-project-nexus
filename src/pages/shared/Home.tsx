// src/pages/shared/Home.tsx
import { useAuth } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserLayout } from '../../layouts/UserLayout';
import AdminDashboard from '../admin/AdminDashboard';
import ActivePolls from '../users/ActivePolls';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nico-base font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-nico-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-nico-primary to-nico-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-nico-text mb-4">
              Access Your Account
            </h2>
            <p className="text-nico-slate-500 mb-6">
              Please login to access your Nico Steel dashboard and manage your operations.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-nico-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              <span>🔑</span>
              <span>Login to Continue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return isAdmin ? (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  ) : (
    <UserLayout>
      <ActivePolls />
    </UserLayout>
  );
};

export default Home;