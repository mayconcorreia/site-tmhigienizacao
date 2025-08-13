import React from 'react';
import { MessageCircle, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { companyInfo } from './mock';

const Footer = () => {
  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de solicitar um orçamento para higienização de estofados.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${companyInfo.phone}`, '_self');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_upholstery-pro/artifacts/9sttfge5_Agendamentos%20Higieniza%C3%A7%C3%A3o%2020250809_225207.jpg" 
                alt="TM Higienização Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">TM Higienização</div>
                <div className="text-xs text-gray-400">Bertioga - SP</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Referência em higienização de estofados em Bertioga. 
              Cuidamos dos seus móveis com carinho e profissionalismo.
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle size={18} className="mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={handleCallClick}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <Phone size={18} className="mr-2" />
                Ligar
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Preços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Serviços</h4>
            <ul className="space-y-3 text-gray-300">
              <li>• Sofás e Poltronas</li>
              <li>• Colchões e Travesseiros</li>
              <li>• Tapetes e Carpetes</li>
              <li>• Bancos Automotivos</li>
              <li>• Cortinas</li>
              <li>• Atendimento Domiciliar</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-400 flex-shrink-0" size={18} />
                <span className="text-gray-300">{companyInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-400 flex-shrink-0" size={18} />
                <span className="text-gray-300">{companyInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-400 flex-shrink-0" size={18} />
                <span className="text-gray-300">{companyInfo.address}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-gray-300">
                  <div>Segunda a Sábado</div>
                  <div className="text-sm">8h às 18h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">
              Pronto para Renovar Seus Estofados?
            </h3>
            <p className="text-purple-100 mb-6">
              Solicite seu orçamento gratuito agora mesmo!
            </p>
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <MessageCircle className="mr-2" size={20} />
              Solicitar Orçamento Grátis
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 TM Higienização. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <span>Bertioga - São Paulo</span>
              <span>•</span>
              <span>Atendimento Profissional</span>
              <span>•</span>
              <span>Garantia Total</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;