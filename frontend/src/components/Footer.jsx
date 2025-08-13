import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { companyInfo } from './mock';

const Footer = () => {
  const handleWhatsAppClick = () => {
    const message = "Olá! Vim através do site e gostaria de mais informações.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${companyInfo.phone}`, '_self');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${companyInfo.email}`, '_self');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  TM Higienização
                </h3>
                <p className="text-sm text-gray-400">Bertioga - SP</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Especialistas em higienização de estofados com equipamentos profissionais 
              e produtos ecológicos. Atendimento domiciliar em toda Bertioga.
            </p>
            <div className="flex space-x-3">
              <button className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-teal-500 rounded-full transition-all duration-300">
                <Instagram size={18} />
              </button>
              <button className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-teal-500 rounded-full transition-all duration-300">
                <Facebook size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200 text-sm"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200 text-sm"
                >
                  Nossos Serviços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200 text-sm"
                >
                  Tabela de Preços
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200 text-sm"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200 text-sm"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nossos Serviços</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Sofás e Poltronas</li>
              <li>• Colchões e Travesseiros</li>
              <li>• Tapetes e Carpetes</li>
              <li>• Bancos Automotivos</li>
              <li>• Cortinas</li>
              <li>• Impermeabilização</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-green-400 transition-colors duration-200"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle size={16} />
                <span className="text-sm">{companyInfo.phone}</span>
              </div>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                onClick={handleCallClick}
              >
                <Phone size={16} />
                <span className="text-sm">{companyInfo.phone}</span>
              </div>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:text-purple-400 transition-colors duration-200"
                onClick={handleEmailClick}
              >
                <Mail size={16} />
                <span className="text-sm">{companyInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span className="text-sm">{companyInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={16} />
                <span className="text-sm">{companyInfo.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 TM Higienização. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <button 
                onClick={scrollToTop}
                className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-teal-400 hover:bg-clip-text transition-all duration-200"
              >
                Voltar ao topo
              </button>
              <span className="text-gray-400">|</span>
              <button 
                onClick={handleWhatsAppClick}
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;