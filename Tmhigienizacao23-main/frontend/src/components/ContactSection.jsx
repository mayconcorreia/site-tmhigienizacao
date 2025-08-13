import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { companyInfo } from './mock';

const ContactSection = () => {
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

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: companyInfo.phone,
      action: handleWhatsAppClick,
      description: "Resposta rápida",
      className: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: companyInfo.phone,
      action: handleCallClick,
      description: "Ligue agora",
      className: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Mail,
      title: "E-mail",
      value: companyInfo.email,
      action: handleEmailClick,
      description: "Envie sua mensagem",
      className: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos prontos para atender você! Escolha a forma de contato de sua preferência 
            e solicite seu orçamento gratuito.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Fale Conosco Agora
            </h3>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full text-white ${method.className}`}>
                        <method.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-gray-600">{method.value}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <Button 
                        onClick={method.action}
                        className={`${method.className} text-white`}
                      >
                        Contatar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Contact CTA */}
            <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-0">
              <CardContent className="p-8 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  🚀 Atendimento Rápido via WhatsApp
                </h4>
                <p className="text-gray-700 mb-6">
                  Receba seu orçamento em menos de 5 minutos!
                </p>
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Solicitar Orçamento Agora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Informações da Empresa
            </h3>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="mr-2 text-blue-600" size={20} />
                    Localização
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{companyInfo.address}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Atendemos toda a cidade de Bertioga e região
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="mr-2 text-blue-600" size={20} />
                    Horário de Atendimento
                  </h4>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{companyInfo.workingHours}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Agendamentos também aos domingos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold text-gray-900">
                    🎯 Por Que Escolher a TM Higienização?
                  </h4>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Orçamento gratuito e sem compromisso
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Atendimento a domicílio
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Produtos ecológicos e seguros
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Profissionais experientes
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Garantia de satisfação
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                🆘 Atendimento de Emergência
              </h4>
              <p className="text-gray-700 mb-4">
                Problemas urgentes com estofados? Atendemos chamadas de emergência!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="mr-2" size={18} />
                  WhatsApp Emergência
                </Button>
                <Button 
                  onClick={handleCallClick}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Phone className="mr-2" size={18} />
                  Ligar Urgente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;