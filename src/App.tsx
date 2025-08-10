// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";
import UserManagement from "./pages/admin/UserManagement";
import PollManagement from "./pages/admin/PollManagement";
import VoteManagement from "./pages/admin/VoteManagement";
import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import Home from "./pages/shared/Home";
import Explore from "./pages/users/Explore";
import History from "./pages/users/History";
import Profile from "./pages/shared/Profile";
import PollCreate from "./pages/users/PollCreate";
import PollDetail from "./pages/users/PollDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/authContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ActivePolls from "./pages/users/ActivePolls";
function App() {
    const { isAuthenticated, isAdmin } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Home route with proper redirection */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/active-polls" replace />
              )
            ) : (
              <Home />
            )
          }
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes - Only accessible by regular users */}
        <Route
          path="/active-polls"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <ActivePolls />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/explore"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <Explore />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <History />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-poll"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <PollCreate />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/poll/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout>
                <PollDetail />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Shared routes that need different layouts based on user role */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              {isAdmin ? (
                <AdminLayout>
                  <Profile />
                </AdminLayout>
              ) : (
                <UserLayout>
                  <Profile />
                </UserLayout>
              )}
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Only accessible by admin users */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PollManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/votes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <VoteManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/home" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;