import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  LayoutDashboard, 
  Sofa, 
  DollarSign, 
  MessageSquare, 
  Building, 
  Users, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: Sofa, label: 'Serviços' },
    { path: '/admin/pricing', icon: DollarSign, label: 'Preços' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Depoimentos' },
    { path: '/admin/company', icon: Building, label: 'Empresa' },
    { path: '/admin/contacts', icon: Users, label: 'Contatos' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-2" />
                Ver Site
              </Link>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                TM Admin
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {user?.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-teal-100 text-purple-700 border border-purple-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;