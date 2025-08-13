// Mock data para TM Higienização
export const mockServices = [
  {
    id: 1,
    title: "Sofás e Poltronas",
    description: "Higienização profunda com produtos específicos para cada tipo de tecido",
    icon: "Sofa",
    features: ["Remoção de manchas", "Eliminação de odores", "Proteção anti-ácaros"]
  },
  {
    id: 2,
    title: "Colchões e Travesseiros", 
    description: "Limpeza especializada para um sono mais saudável",
    icon: "Bed",
    features: ["Aspiração profunda", "Sanitização completa", "Secagem rápida"]
  },
  {
    id: 3,
    title: "Tapetes e Carpetes",
    description: "Restauração da beleza original dos seus tapetes",
    icon: "Home",
    features: ["Lavagem com shampoo", "Remoção de pelos", "Impermeabilização"]
  },
  {
    id: 4,
    title: "Bancos Automotivos",
    description: "Cuidado especial para o interior do seu veículo",
    icon: "Car",
    features: ["Limpeza de couro", "Tecidos automotivos", "Proteção UV"]
  },
  {
    id: 5,
    title: "Cortinas",
    description: "Higienização sem retirar de casa",
    icon: "Sun",
    features: ["Limpeza no local", "Todos os tecidos", "Secagem natural"]
  }
];

export const mockPricing = [
  {
    category: "Sofás",
    items: [
      { name: "Sofá 2 lugares - Tecido comum", price: "R$ 80" },
      { name: "Sofá 2 lugares - Couro/Suede", price: "R$ 100" },
      { name: "Sofá 3 lugares - Tecido comum", price: "R$ 120" },
      { name: "Sofá 3 lugares - Couro/Suede", price: "R$ 150" },
      { name: "Sofá de canto - Tecido comum", price: "R$ 180" },
      { name: "Sofá de canto - Couro/Suede", price: "R$ 220" }
    ]
  },
  {
    category: "Poltronas e Cadeiras",
    items: [
      { name: "Poltrona - Tecido comum", price: "R$ 50" },
      { name: "Poltrona - Couro/Suede", price: "R$ 70" },
      { name: "Cadeira estofada", price: "R$ 30" },
      { name: "Cadeira de couro", price: "R$ 40" }
    ]
  },
  {
    category: "Colchões",
    items: [
      { name: "Colchão Solteiro", price: "R$ 60" },
      { name: "Colchão Casal", price: "R$ 80" },
      { name: "Colchão Queen", price: "R$ 100" },
      { name: "Colchão King", price: "R$ 120" },
      { name: "Travesseiro (unidade)", price: "R$ 15" }
    ]
  },
  {
    category: "Tapetes e Carpetes",
    items: [
      { name: "Tapete pequeno (até 2m²)", price: "R$ 40" },
      { name: "Tapete médio (2-4m²)", price: "R$ 60" },
      { name: "Tapete grande (4-6m²)", price: "R$ 80" },
      { name: "Carpete (por m²)", price: "R$ 25" }
    ]
  },
  {
    category: "Bancos Automotivos",
    items: [
      { name: "Banco dianteiro - Tecido", price: "R$ 40" },
      { name: "Banco dianteiro - Couro", price: "R$ 60" },
      { name: "Banco traseiro - Tecido", price: "R$ 60" },
      { name: "Banco traseiro - Couro", price: "R$ 80" },
      { name: "Conjunto completo - Tecido", price: "R$ 150" },
      { name: "Conjunto completo - Couro", price: "R$ 200" }
    ]
  },
  {
    category: "Cortinas",
    items: [
      { name: "Cortina pequena (até 2m)", price: "R$ 50" },
      { name: "Cortina média (2-3m)", price: "R$ 70" },
      { name: "Cortina grande (3-4m)", price: "R$ 90" },
      { name: "Persiana", price: "R$ 40" }
    ]
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Maria Silva",
    location: "Bertioga Centro",
    rating: 5,
    text: "Serviço impecável! Meu sofá ficou como novo. Super recomendo a TM Higienização!"
  },
  {
    id: 2,
    name: "João Santos",
    location: "Jardim Esmeralda",
    rating: 5,
    text: "Profissionais muito competentes. Fizeram a limpeza dos bancos do meu carro e ficou perfeito."
  },
  {
    id: 3,
    name: "Ana Costa",
    location: "Vila Itapanhaú",
    rating: 5,
    text: "Atendimento excelente e preço justo. Já indiquei para várias amigas!"
  }
];

export const companyInfo = {
  name: "TM Higienização",
  location: "Bertioga - São Paulo",
  phone: "(13) 99704-3410",
  whatsapp: "5513997043410",
  email: "contato@tmhigienizacao.com.br",
  address: "Bertioga, São Paulo",
  workingHours: "Segunda a Sábado: 8h às 18h"
};