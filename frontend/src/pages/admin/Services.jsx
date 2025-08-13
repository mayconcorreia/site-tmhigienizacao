import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit2, Trash2, Sofa, Bed, Home, Car, Sun, X } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Sofa',
    features: [],
    active: true
  });
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();

  const iconOptions = [
    { value: 'Sofa', label: 'Sofá', icon: Sofa },
    { value: 'Bed', label: 'Cama', icon: Bed },
    { value: 'Home', label: 'Casa', icon: Home },
    { value: 'Car', label: 'Carro', icon: Car },
    { value: 'Sun', label: 'Sol', icon: Sun }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: 'Erro ao carregar serviços',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await adminAPI.updateService(editingService.id, formData);
        toast({
          title: '✅ Sucesso',
          description: 'Serviço atualizado com sucesso'
        });
      } else {
        await adminAPI.createService(formData);
        toast({
          title: '✅ Sucesso',
          description: 'Serviço criado com sucesso'
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: 'Erro ao salvar serviço',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: [...service.features],
      active: service.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await adminAPI.deleteService(serviceId);
        toast({
          title: '✅ Sucesso',
          description: 'Serviço excluído com sucesso'
        });
        fetchServices();
      } catch (error) {
        toast({
          title: '❌ Erro',
          description: 'Erro ao excluir serviço',
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: 'Sofa',
      features: [],
      active: true
    });
    setEditingService(null);
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const getIcon = (iconName) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent size={20} />;
    }
    return <Sofa size={20} />;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
          <p className="text-gray-600">Administre os serviços oferecidos pela TM Higienização</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
              onClick={resetForm}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Sofás e Poltronas"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ícone</label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <option.icon size={16} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição detalhada do serviço"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Características ({formData.features.length})
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ex: Remoção de manchas"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
                
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Serviço ativo (visível no site)
                </label>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingService ? 'Atualizar' : 'Criar'} Serviço
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-teal-100 text-purple-600 rounded-lg">
                  {getIcon(service.icon)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {service.features.length} características
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Características:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {services.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Sofa className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-gray-600 mb-4">Comece criando o primeiro serviço da TM Higienização</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Services;