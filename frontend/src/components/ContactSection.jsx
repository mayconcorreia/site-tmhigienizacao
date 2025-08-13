import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { companyInfo, mockServices } from './mock';
import { apiService } from '../services/api';
import { useToast } from '../hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      service: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to API
      await apiService.submitContact(formData);
      
      // Send to WhatsApp
      const message = `*Novo contato do site:*
Nome: ${formData.name}
Telefone: ${formData.phone}
Email: ${formData.email}
Serviço: ${formData.service}
Mensagem: ${formData.message}`;
      
      const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: ''
      });
      
      toast({
        title: '✅ Mensagem enviada!',
        description: 'Entraremos em contato em breve.',
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: '❌ Erro ao enviar',
        description: 'Tente novamente ou entre em contato diretamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de solicitar um orçamento para higienização de estofados.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${companyInfo.phone}`, '_self');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${companyInfo.email}`, '_self');
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Solicite seu orçamento gratuito ou tire suas dúvidas. Estamos prontos para atendê-lo!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-t-lg">
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                Solicitar Orçamento
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="(13) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviço de Interesse
                  </label>
                  <Select onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.title}>
                          {service.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full"
                    rows={4}
                    placeholder="Descreva detalhes sobre o serviço desejado..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2" size={20} />
                      Enviar via WhatsApp
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  Formas de Contato
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer" onClick={handleWhatsAppClick}>
                    <div className="p-3 bg-green-600 text-white rounded-full">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                      <p className="text-sm text-green-600">Clique para enviar mensagem</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer" onClick={handleCallClick}>
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Telefone</p>
                      <p className="text-gray-600">{companyInfo.phone}</p>
                      <p className="text-sm text-blue-600">Clique para ligar</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 cursor-pointer" onClick={handleEmailClick}>
                    <div className="p-3 bg-purple-600 text-white rounded-full">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">E-mail</p>
                      <p className="text-gray-600">{companyInfo.email}</p>
                      <p className="text-sm text-purple-600">Clique para enviar e-mail</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-3 bg-gray-600 text-white rounded-full">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Localização</p>
                      <p className="text-gray-600">{companyInfo.address}</p>
                      <p className="text-sm text-gray-500">Atendimento domiciliar</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-lg">
                    <div className="p-3 bg-teal-600 text-white rounded-full">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Horário de Funcionamento</p>
                      <p className="text-gray-600">{companyInfo.workingHours}</p>
                      <p className="text-sm text-teal-600">Agendamento flexível</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-4">
                  Atendimento Imediato
                </h4>
                <p className="mb-6">
                  Precisa de um orçamento urgente? Entre em contato agora mesmo pelo WhatsApp!
                </p>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Chamar no WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;