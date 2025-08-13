import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Sofa, Bed, Home, Car, Sun, CheckCircle, MessageCircle } from 'lucide-react';
import { companyInfo } from './mock';
import { apiService } from '../services/api';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesData = await apiService.getServices();
        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Erro ao carregar serviços. Tente novamente.');
        // Keep mock data as fallback
        const { mockServices } = await import('./mock');
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Sofa: Sofa,
      Bed: Bed,
      Home: Home,
      Car: Car,
      Sun: Sun
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent size={32} /> : <Sofa size={32} />;
  };

  const handleWhatsAppClick = (service) => {
    const message = `Olá! Gostaria de solicitar um orçamento para ${service.title.toLowerCase()}.`;
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando serviços...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços de Higienização
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Oferecemos higienização profissional para todos os tipos de estofados 
            com equipamentos modernos e produtos de alta qualidade.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-100 to-teal-100 text-purple-600 rounded-full w-fit group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-cyan-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-300">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleWhatsAppClick(service)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Solicitar Orçamento
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Como Funciona Nosso Processo
            </h3>
            <p className="text-lg text-gray-600">
              Um processo simples e eficiente para deixar seus estofados como novos
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full w-fit">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Análise</h4>
              <p className="text-gray-600 text-sm">
                Avaliamos o tipo de tecido e o nível de sujeira
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full w-fit">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Pré-tratamento</h4>
              <p className="text-gray-600 text-sm">
                Aplicamos produtos específicos nas manchas
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full w-fit">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Higienização</h4>
              <p className="text-gray-600 text-sm">
                Limpeza profunda com equipamentos profissionais
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full w-fit">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Finalização</h4>
              <p className="text-gray-600 text-sm">
                Secagem rápida e proteção dos tecidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;