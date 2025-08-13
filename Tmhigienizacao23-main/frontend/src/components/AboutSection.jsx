import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Shield, Clock, Users, Award, MessageCircle, CheckCircle } from 'lucide-react';
import { companyInfo } from './mock';
import { apiService } from '../services/api';

const AboutSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const testimonialsData = await apiService.getTestimonials();
        setTestimonials(testimonialsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Erro ao carregar depoimentos. Tente novamente.');
        // Keep mock data as fallback
        const { mockTestimonials } = await import('./mock');
        setTestimonials(mockTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleWhatsAppClick = () => {
    const message = "Olá! Gostaria de conhecer mais sobre os serviços da TM Higienização.";
    const url = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const features = [
    {
      icon: Shield,
      title: "Garantia de Qualidade",
      description: "Produtos profissionais e técnicas especializadas para cada tipo de tecido"
    },
    {
      icon: Clock,
      title: "Atendimento Ágil",
      description: "Agendamento flexível e execução no prazo combinado"
    },
    {
      icon: Users,
      title: "Equipe Experiente",
      description: "Profissionais treinados com anos de experiência no mercado"
    },
    {
      icon: Award,
      title: "Satisfação Garantida",
      description: "Compromisso com a excelência e satisfação total do cliente"
    }
  ];

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* About Company */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Sobre a TM Higienização
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                A <strong>TM Higienização</strong> é referência em higienização de estofados 
                em Bertioga e região. Com anos de experiência no mercado, oferecemos 
                serviços de alta qualidade para residências, empresas e veículos.
              </p>
              <p>
                Nossa missão é proporcionar ambientes mais saudáveis e confortáveis, 
                utilizando equipamentos de última geração e produtos ecologicamente corretos. 
                Garantimos resultados excepcionais com total segurança para sua família.
              </p>
              <p>
                Atendemos toda a cidade de Bertioga com pontualidade, profissionalismo 
                e preços justos. Nosso compromisso é com a sua satisfação total.
              </p>
            </div>

            <div className="mt-8">
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
              >
                <MessageCircle className="mr-2" size={20} />
                Falar Conosco
              </Button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-teal-100 text-purple-600 rounded-full w-fit">
                      <feature.icon size={24} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Por Que Escolher a TM Higienização?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Equipamentos Profissionais</h4>
                <p className="text-gray-600 text-sm">Utilizamos equipamentos de extração a vapor de última geração</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Produtos Ecológicos</h4>
                <p className="text-gray-600 text-sm">Produtos biodegradáveis, seguros para crianças e pets</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Secagem Rápida</h4>
                <p className="text-gray-600 text-sm">Técnicas que aceleram o processo de secagem</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Atendimento Domiciliar</h4>
                <p className="text-gray-600 text-sm">Comodidade total, atendemos na sua casa ou empresa</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Preços Competitivos</h4>
                <p className="text-gray-600 text-sm">Melhor custo-benefício da região</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Garantia Total</h4>
                <p className="text-gray-600 text-sm">Satisfação garantida ou refazemos o serviço</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h3>
            <p className="text-lg text-gray-600">
              Depoimentos reais de clientes satisfeitos
            </p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm">
                {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando depoimentos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-5 h-5 text-yellow-400 fill-current">⭐</div>
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;