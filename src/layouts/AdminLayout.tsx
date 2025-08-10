import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  adminName?: string;
  adminAvatar?: string;
  onLogout?: () => void;
}

export const AdminLayout = ({ 
  children, 
  adminName = "Admin",
  adminAvatar,
  onLogout = () => {}
}: AdminLayoutProps) => {
  // Use the useLocation hook to get the current URL path
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // The navigation items now contain the full path for routing
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z" />
        </svg>
      ),
      color: 'from-jordy-blue to-light-sky-blue'
    },
    { 
      id: 'polls', 
      label: 'Poll Management',
      path: '/admin/polls',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-forest-green to-forest-green/80'
    },
    { 
      id: 'users', 
      label: 'User Management',
      path: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'from-amber to-amber/80'
    },
    { 
      id: 'votes', 
      label: 'Vote Management',
      path: '/admin/votes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-mimi-pink to-mimi-pink/80'
    }
  ];

  const stats = [
    { label: 'Total Polls', value: '1,234', change: '+12%', color: 'text-forest-green' },
    { label: 'Active Users', value: '5,678', change: '+8%', color: 'text-jordy-blue' },
    { label: 'Total Votes', value: '12,345', change: '+15%', color: 'text-mimi-pink' },
    { label: 'Response Rate', value: '87%', change: '+3%', color: 'text-amber' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-charcoal to-dark-bg text-dark-text">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-6 z-50 flex items-center justify-center w-12 h-12 bg-charcoal/90 backdrop-blur-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-light-gray/20 group ${
          sidebarOpen ? 'left-[320px]' : 'left-6'
        }`}
      >
        <svg
          className={`w-5 h-5 text-dark-text transition-all duration-300 group-hover:text-jordy-blue ${
            sidebarOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-gradient-to-b from-charcoal/95 via-charcoal/90 to-dark-bg/95 backdrop-blur-xl border-r border-light-gray/10 shadow-2xl">
          {/* Admin Header */}
          <div className="p-6 bg-gradient-to-r from-jordy-blue/20 to-light-sky-blue/20 border-b border-light-gray/10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {adminAvatar ? (
                  <img 
                    src={adminAvatar} 
                    alt="Admin" 
                    className="w-14 h-14 rounded-full object-cover ring-3 ring-jordy-blue/50 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-jordy-blue to-light-sky-blue rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-forest-green rounded-full border-2 border-charcoal flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white">{adminName}</h3>
                <p className="text-sm text-dark-text/70">System Administrator</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-forest-green rounded-full mr-2"></div>
                  <span className="text-xs text-forest-green">Online</span>
                </div>
              </div>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                // Use a Link component instead of a button for navigation
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 flex items-center px-5 py-4 ${
                    // Check if the current path matches the item's path for active state styling
                    location.pathname === item.path
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : 'text-dark-text hover:bg-dark-bg/50 hover:text-white hover:translate-x-2'
                  }`}
                >
                  <div className={`mr-4 transition-all duration-300 ${
                    location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {location.pathname === item.path && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  {location.pathname !== item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-light-gray/10">
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-3 text-dark-text/80 hover:text-white hover:bg-dark-bg/50 rounded-lg transition-all duration-200 group">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Settings</span>
              </button>
              
              <button 
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 text-coral-red hover:text-white hover:bg-coral-red/20 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
        sidebarOpen ? 'left-80' : 'left-0'
      }`}>
        <div className="bg-charcoal/80 backdrop-blur-xl border-b border-light-gray/10 shadow-lg">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {/* Dynamically display the page title based on the current path */}
                {location.pathname === '/admin/dashboard' && 'Admin Dashboard'}
                {location.pathname === '/admin/polls' && 'Poll Management'}
                {location.pathname === '/admin/users' && 'User Management'}
                {location.pathname === '/admin/votes' && 'Vote Management'}
              </h1>
              <p className="text-sm text-dark-text/70">
                {location.pathname === '/admin/dashboard' && 'Overview of your poll application'}
                {location.pathname === '/admin/polls' && 'Manage and monitor all polls'}
                {location.pathname === '/admin/users' && 'Manage user accounts and permissions'}
                {location.pathname === '/admin/votes' && 'Monitor voting activity and analytics'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-dark-text hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-12a3 3 0 00-6 0v12m6 0a3 3 0 01-6 0" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-red rounded-full"></div>
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-jordy-blue to-light-sky-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <main className="pt-24 p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
