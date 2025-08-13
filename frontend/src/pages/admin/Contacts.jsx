import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar,
  MessageSquare,
  Filter,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'contacted', label: 'Contatado' },
    { value: 'converted', label: 'Convertido' },
    { value: 'closed', label: 'Fechado' }
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getContacts();
      setContacts(data);
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: 'Erro ao carregar contatos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      await adminAPI.updateContactStatus(contactId, newStatus);
      toast({
        title: '✅ Sucesso',
        description: 'Status do contato atualizado'
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: 'Erro ao atualizar status',
        variant: 'destructive'
      });
    }
  };

  const deleteContact = async (contactId) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await adminAPI.deleteContact(contactId);
        toast({
          title: '✅ Sucesso',
          description: 'Contato excluído com sucesso'
        });
        fetchContacts();
      } catch (error) {
        toast({
          title: '❌ Erro',
          description: 'Erro ao excluir contato',
          variant: 'destructive'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'converted': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Desconhecido';
  };

  const openWhatsApp = (phone, name) => {
    const message = `Olá ${name}! Recebemos sua mensagem através do site da TM Higienização e entramos em contato para ajudá-lo.`;
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Contatos</h1>
        <p className="text-gray-600">Administre os contatos recebidos pelo site</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = contacts.filter(c => c.status === status.value).length;
          return (
            <Card key={status.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{status.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-2 rounded-full ${getStatusColor(status.value)}`}>
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, telefone, email ou mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <Badge className={getStatusColor(contact.status)}>
                      {getStatusLabel(contact.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(contact.created_at).toLocaleDateString('pt-BR')} às {new Date(contact.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {contact.service && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                        <span>Serviço: {contact.service}</span>
                      </div>
                    )}
                  </div>
                  
                  {contact.message && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Mensagem:</strong> {contact.message}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 lg:ml-6">
                  <Select 
                    value={contact.status} 
                    onValueChange={(newStatus) => updateContactStatus(contact.id, newStatus)}
                  >
                    <SelectTrigger className="w-full lg:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.slice(1).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => openWhatsApp(contact.phone, contact.name)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Nenhum contato encontrado' : 'Nenhum contato recebido'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Os contatos recebidos pelo site aparecerão aqui'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Contacts;