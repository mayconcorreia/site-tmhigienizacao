import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Tag } from 'lucide-react';
import { companyInfo } from './mock';
import { apiService } from '../services/api';

const PricingSection = () => {
  const [pricing, setPricing] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const pricingData = await apiService.getPricing();
        setPricing(pricingData);
        if (pricingData.length > 0) {
          setSelectedCategory(pricingData[0].category);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching pricing:', err);
        setError('Erro ao carregar preços. Tente novamente.');
        // Keep mock data as fallback
        const { mockPricing } = await import('./mock');
        setPricing(mockPricing);
        setSelectedCategory(mockPricing[0].category);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const handleWhatsAppClick = (item) => {
    const message = `Olá! Gostaria de solicitar o serviço: ${item.name} - ${item.price}`;
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleGeneralWhatsAppClick = () => {
    const message = "Olá! Gostaria de solicitar um orçamento personalizado para higienização de estofados.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const selectedCategoryData = pricing.find(category => category.category === selectedCategory);

  if (loading) {
    return (
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando preços...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tabela de Preços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preços competitivos e transparentes. Os valores podem variar conforme o estado 
            do estofado e tipo de tecido.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {pricing.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.category)}
              variant={selectedCategory === category.category ? "default" : "outline"}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.category 
                  ? 'bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 text-white shadow-lg border-transparent' 
                  : 'border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-teal-50'
              }`}
            >
              {category.category}
            </Button>
          ))}
        </div>

        {/* Selected Category Items */}
        {selectedCategoryData && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-teal-50 rounded-t-lg">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                  <Tag className="mr-2" size={24} />
                  {selectedCategoryData.category}
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {selectedCategoryData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-teal-50 transition-colors duration-200">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">{item.price}</span>
                        <Button 
                          onClick={() => handleWhatsAppClick(item)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle size={16} className="mr-1" />
                          Solicitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Promotional Section */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 via-teal-50 to-cyan-50 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Promoção Especial
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Na contratação de 3 ou mais serviços, ganhe <strong>15% de desconto</strong> no valor total!
              </p>
              <Button 
                onClick={handleGeneralWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-lg"
              >
                <MessageCircle className="mr-2" size={20} />
                Solicitar Orçamento com Desconto
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">📋 Observações Importantes:</h4>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Os preços podem variar conforme o estado de conservação do estofado</li>
            <li>• Tecidos especiais (seda, veludo, etc.) têm valores diferenciados</li>
            <li>• Manchas antigas ou difíceis podem ter custo adicional</li>
            <li>• Atendemos toda a região de Bertioga sem taxa de deslocamento</li>
            <li>• Orçamento gratuito e sem compromisso</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;