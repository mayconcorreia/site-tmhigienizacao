import React from 'react';
import { Button } from './ui/button';
import { MessageCircle, CheckCircle, Star } from 'lucide-react';
import { companyInfo } from './mock';

const HeroSection = () => {
  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de solicitar um orçamento para higienização de estofados.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${companyInfo.phone}`, '_self');
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-purple-50 via-white to-teal-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-teal-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-1" />
              Avaliação 5 estrelas no Google
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Higienização de 
              <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent"> Estofados</span> em 
              <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent"> Bertioga</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Transformamos seus estofados com higienização profissional. Sofás, colchões, 
              tapetes, bancos automotivos e cortinas. Atendimento domiciliar com 
              equipamentos de última geração.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle size={20} />
                <span>Solicitar Orçamento</span>
              </Button>
              
              <Button 
                onClick={handleCallClick}
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:via-cyan-500 hover:to-teal-500 hover:text-white hover:border-transparent px-8 py-4 text-lg rounded-lg transition-all duration-300"
              >
                Ligar Agora
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Atendimento a domicílio</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Produtos ecológicos</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Secagem rápida</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Orçamento Grátis
                </h3>
                <p className="text-gray-600">
                  Receba seu orçamento em poucos minutos
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-700">Escolha o serviço desejado</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-700">Receba orçamento personalizado</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-700">Agende o melhor horário</span>
                </div>
              </div>

              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 mt-6 text-lg rounded-lg transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar via WhatsApp
              </Button>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full opacity-30 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full opacity-30 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;