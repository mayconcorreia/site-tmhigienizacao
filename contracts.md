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

## ADMIN AREA - Funcionalidades

### 1. Dashboard Admin
- Login simples com senha
- Estatísticas básicas (contatos recebidos, serviços mais solicitados)
- Acesso rápido às seções de gerenciamento

### 2. Gerenciar Serviços
- CRUD completo para serviços
- Campos: title, description, icon, features[], active
- Interface drag-and-drop para reordenar

### 3. Gerenciar Preços
- CRUD para categorias de preços
- CRUD para itens dentro de cada categoria
- Campos: category, items[{name, price, description}]

### 4. Gerenciar Depoimentos
- CRUD para testimonials
- Campos: name, location, rating, text, active
- Aprovação manual de novos depoimentos

### 5. Gerenciar Informações da Empresa
- Editar dados de contato
- Horários de funcionamento
- Endereço e informações gerais

### 6. Contatos Recebidos
- Lista de todos os contatos do formulário
- Status: pending, contacted, converted, closed
- Filtros e busca
- Exportar para CSV

## APIs a Implementar no Backend

### Admin Authentication
POST /api/admin/login
GET /api/admin/verify

### Services Management
GET /api/admin/services
POST /api/admin/services
PUT /api/admin/services/:id
DELETE /api/admin/services/:id

### Pricing Management  
GET /api/admin/pricing
POST /api/admin/pricing
PUT /api/admin/pricing/:id
DELETE /api/admin/pricing/:id

### Testimonials Management
GET /api/admin/testimonials
POST /api/admin/testimonials
PUT /api/admin/testimonials/:id
DELETE /api/admin/testimonials/:id

### Company Info Management
GET /api/admin/company-info
PUT /api/admin/company-info

### Contacts Management
GET /api/admin/contacts
PUT /api/admin/contacts/:id/status
DELETE /api/admin/contacts/:id

## Frontend Admin Pages

### Routes
- /admin/login - Página de login
- /admin/dashboard - Dashboard principal
- /admin/services - Gerenciar serviços
- /admin/pricing - Gerenciar preços
- /admin/testimonials - Gerenciar depoimentos
- /admin/company - Informações da empresa
- /admin/contacts - Contatos recebidos

### Protected Routes
- Verificação de token JWT
- Redirecionamento para login se não autenticado
- Layout admin com sidebar navigation

## Próximos Passos
1. Criar backend com todas as APIs
2. Implementar autenticação JWT
3. Criar páginas do admin
4. Integrar frontend público com backend
5. Testes completos