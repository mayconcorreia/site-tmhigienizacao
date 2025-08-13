import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Sofa, 
  DollarSign, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalServices: 0,
    totalPricing: 0,
    totalTestimonials: 0,
    pendingContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [contacts, services, pricing, testimonials] = await Promise.all([
        adminAPI.getContacts(),
        adminAPI.getServices(),
        adminAPI.getPricing(),
        adminAPI.getTestimonials()
      ]);

      setStats({
        totalContacts: contacts.length,
        totalServices: services.length,
        totalPricing: pricing.length,
        totalTestimonials: testimonials.length,
        pendingContacts: contacts.filter(c => c.status === 'pending').length
      });

      // Get recent contacts (last 5)
      setRecentContacts(contacts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'contacted': return 'text-blue-600 bg-blue-100';
      case 'converted': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'contacted': return 'Contatado';
      case 'converted': return 'Convertido';
      case 'closed': return 'Fechado';
      default: return 'Desconhecido';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da TM Higienização</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Contatos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalServices}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Sofa className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias de Preços</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPricing}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Depoimentos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTestimonials}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending contacts */}
      {stats.pendingContacts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">
                  Você tem {stats.pendingContacts} contato{stats.pendingContacts > 1 ? 's' : ''} pendente{stats.pendingContacts > 1 ? 's' : ''}
                </h3>
                <p className="text-yellow-700">
                  {stats.pendingContacts > 1 ? 'Eles precisam' : 'Ele precisa'} da sua atenção para resposta.
                </p>
              </div>
              <Link to="/admin/contacts">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Ver Contatos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Contatos Recentes
            </h3>
          </CardHeader>
          <CardContent>
            {recentContacts.length > 0 ? (
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </div>
                ))}
                <Link to="/admin/contacts">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Contatos
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhum contato ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Ações Rápidas
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/admin/services" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Sofa className="mr-2 h-4 w-4" />
                  Gerenciar Serviços
                </Button>
              </Link>
              <Link to="/admin/pricing" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Atualizar Preços
                </Button>
              </Link>
              <Link to="/admin/testimonials" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Novos Depoimentos
                </Button>
              </Link>
              <Link to="/admin/company" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Informações da Empresa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;