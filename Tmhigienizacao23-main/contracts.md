# Contratos de API - TM Higienização

## Dados Mock Atuais (mock.js)

### mockServices
- Serviços oferecidos (id, title, description, icon, features)
- Usado em: ServicesSection.jsx

### mockPricing  
- Tabela de preços por categoria
- Estrutura: category, items[{name, price}]
- Usado em: PricingSection.jsx

### mockTestimonials
- Depoimentos de clientes (id, name, location, rating, text)
- Usado em: AboutSection.jsx

### companyInfo
- Informações da empresa (name, location, phone, whatsapp, email, etc.)
- Usado em: Todos os componentes para contato

## APIs a Implementar no Backend

### 1. GET /api/services
Retorna lista de serviços
```json
{
  "services": [
    {
      "id": "1",
      "title": "Sofás e Poltronas",
      "description": "Higienização profunda...",
      "icon": "Sofa",
      "features": ["Remoção de manchas", "..."]
    }
  ]
}
```

### 2. GET /api/pricing
Retorna tabela de preços
```json
{
  "pricing": [
    {
      "category": "Sofás",
      "items": [
        {"name": "Sofá 2 lugares", "price": "R$ 80"}
      ]
    }
  ]
}
```

### 3. GET /api/testimonials
Retorna depoimentos
```json
{
  "testimonials": [
    {
      "id": "1",
      "name": "Maria Silva",
      "location": "Bertioga Centro",
      "rating": 5,
      "text": "Serviço impecável!"
    }
  ]
}
```

### 4. POST /api/contact
Recebe contatos/orçamentos
```json
Request:
{
  "name": "João Silva",
  "phone": "(13) 99999-9999", 
  "email": "joao@email.com",
  "service": "Sofá 3 lugares",
  "message": "Gostaria de um orçamento",
  "source": "whatsapp" | "form" | "phone"
}

Response:
{
  "success": true,
  "message": "Contato recebido com sucesso",
  "contact_id": "uuid"
}
```

### 5. GET /api/company-info
Retorna informações da empresa
```json
{
  "company": {
    "name": "TM Higienização",
    "location": "Bertioga - São Paulo",
    "phone": "(13) 99704-3410",
    "whatsapp": "5513997043410",
    "email": "contato@tmhigienizacao.com.br",
    "address": "Bertioga, São Paulo",
    "workingHours": "Segunda a Sábado: 8h às 18h"
  }
}
```

## Modelos MongoDB

### Service
```python
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    features: List[str]
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### PricingCategory  
```python
class PricingItem(BaseModel):
    name: str
    price: str
    description: Optional[str] = None

class PricingCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    items: List[PricingItem]
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Testimonial
```python
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    rating: int = Field(ge=1, le=5)
    text: str
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Contact
```python
class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    service: Optional[str] = None
    message: str
    source: str  # 'whatsapp', 'form', 'phone'
    status: str = "pending"  # 'pending', 'contacted', 'converted', 'closed'
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## Integração Frontend

### Substituir dados mock por APIs:
1. **mockServices** → GET /api/services em ServicesSection.jsx
2. **mockPricing** → GET /api/pricing em PricingSection.jsx  
3. **mockTestimonials** → GET /api/testimonials em AboutSection.jsx
4. **companyInfo** → GET /api/company-info em todos os componentes

### WhatsApp Integration
- Manter lógica atual (redirecionamento para WhatsApp)
- Adicionar tracking via POST /api/contact para analytics
- Capturar dados: serviço solicitado, origem do clique

## Funcionalidades Backend

1. **CRUD Completo** para todos os modelos
2. **Seeding** inicial com dados do mock.js
3. **Validação** de dados de entrada
4. **Logs** de contatos/orçamentos para análise
5. **API RESTful** com padrão consistente

## Próximos Passos

1. Implementar modelos no backend
2. Criar endpoints com dados iniciais
3. Substituir mock por calls API no frontend
4. Testar integração completa
5. Implementar analytics básicos de contatos