from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models for TM Higienização
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    features: List[str]
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    title: str
    description: str
    icon: str
    features: List[str]

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

class PricingCategoryCreate(BaseModel):
    category: str
    items: List[PricingItem]

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    rating: int = Field(ge=1, le=5)
    text: str
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    location: str
    rating: int = Field(ge=1, le=5)
    text: str

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

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: Optional[str] = None
    message: str
    source: str = "form"

class CompanyInfo(BaseModel):
    name: str
    location: str
    phone: str
    whatsapp: str
    email: str
    address: str
    workingHours: str

# Legacy status check models (keeping for compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# TM Higienização API Routes

@api_router.get("/services")
async def get_services():
    """Get all active services"""
    try:
        services = await db.services.find({"active": True}).to_list(1000)
        return {"services": [Service(**service) for service in services]}
    except Exception as e:
        logger.error(f"Error fetching services: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch services")

@api_router.get("/pricing")
async def get_pricing():
    """Get all active pricing categories"""
    try:
        pricing = await db.pricing.find({"active": True}).to_list(1000)
        return {"pricing": [PricingCategory(**price) for price in pricing]}
    except Exception as e:
        logger.error(f"Error fetching pricing: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch pricing")

@api_router.get("/testimonials")
async def get_testimonials():
    """Get all active testimonials"""
    try:
        testimonials = await db.testimonials.find({"active": True}).to_list(1000)
        return {"testimonials": [Testimonial(**testimonial) for testimonial in testimonials]}
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch testimonials")

@api_router.get("/company-info")
async def get_company_info():
    """Get company information"""
    try:
        company_data = await db.company_info.find_one({})
        if not company_data:
            # Return default company info if not found in database
            default_info = {
                "name": "TM Higienização",
                "location": "Bertioga - São Paulo",
                "phone": "(13) 99704-3410",
                "whatsapp": "5513997043410",
                "email": "contato@tmhigienizacao.com.br",
                "address": "Bertioga, São Paulo",
                "workingHours": "Segunda a Sábado: 8h às 18h"
            }
            return {"company": default_info}
        
        # Remove MongoDB _id field
        company_data.pop('_id', None)
        return {"company": company_data}
    except Exception as e:
        logger.error(f"Error fetching company info: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch company information")

@api_router.post("/contact")
async def create_contact(contact_data: ContactCreate):
    """Create a new contact/quote request"""
    try:
        contact = Contact(**contact_data.dict())
        await db.contacts.insert_one(contact.dict())
        return {
            "success": True,
            "message": "Contato recebido com sucesso",
            "contact_id": contact.id
        }
    except Exception as e:
        logger.error(f"Error creating contact: {e}")
        raise HTTPException(status_code=500, detail="Failed to create contact")

# Database seeding endpoint (for development)
@api_router.post("/seed-data")
async def seed_database():
    """Seed database with initial mock data"""
    try:
        # Check if data already exists
        existing_services = await db.services.count_documents({})
        if existing_services > 0:
            return {"message": "Database already seeded"}

        # Mock services data
        mock_services = [
            {
                "id": str(uuid.uuid4()),
                "title": "Sofás e Poltronas",
                "description": "Higienização profunda com produtos específicos para cada tipo de tecido",
                "icon": "Sofa",
                "features": ["Remoção de manchas", "Eliminação de odores", "Proteção anti-ácaros"],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Colchões e Travesseiros",
                "description": "Limpeza especializada para um sono mais saudável",
                "icon": "Bed",
                "features": ["Aspiração profunda", "Sanitização completa", "Secagem rápida"],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Tapetes e Carpetes",
                "description": "Restauração da beleza original dos seus tapetes",
                "icon": "Home",
                "features": ["Lavagem com shampoo", "Remoção de pelos", "Impermeabilização"],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Bancos Automotivos",
                "description": "Cuidado especial para o interior do seu veículo",
                "icon": "Car",
                "features": ["Limpeza de couro", "Tecidos automotivos", "Proteção UV"],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Cortinas",
                "description": "Higienização sem retirar de casa",
                "icon": "Sun",
                "features": ["Limpeza no local", "Todos os tecidos", "Secagem natural"],
                "active": True,
                "created_at": datetime.utcnow()
            }
        ]

        # Mock pricing data
        mock_pricing = [
            {
                "id": str(uuid.uuid4()),
                "category": "Sofás",
                "items": [
                    {"name": "Sofá 2 lugares - Tecido comum", "price": "R$ 80"},
                    {"name": "Sofá 2 lugares - Couro/Suede", "price": "R$ 100"},
                    {"name": "Sofá 3 lugares - Tecido comum", "price": "R$ 120"},
                    {"name": "Sofá 3 lugares - Couro/Suede", "price": "R$ 150"},
                    {"name": "Sofá de canto - Tecido comum", "price": "R$ 180"},
                    {"name": "Sofá de canto - Couro/Suede", "price": "R$ 220"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "category": "Poltronas e Cadeiras",
                "items": [
                    {"name": "Poltrona - Tecido comum", "price": "R$ 50"},
                    {"name": "Poltrona - Couro/Suede", "price": "R$ 70"},
                    {"name": "Cadeira estofada", "price": "R$ 30"},
                    {"name": "Cadeira de couro", "price": "R$ 40"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "category": "Colchões",
                "items": [
                    {"name": "Colchão Solteiro", "price": "R$ 60"},
                    {"name": "Colchão Casal", "price": "R$ 80"},
                    {"name": "Colchão Queen", "price": "R$ 100"},
                    {"name": "Colchão King", "price": "R$ 120"},
                    {"name": "Travesseiro (unidade)", "price": "R$ 15"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "category": "Tapetes e Carpetes",
                "items": [
                    {"name": "Tapete pequeno (até 2m²)", "price": "R$ 40"},
                    {"name": "Tapete médio (2-4m²)", "price": "R$ 60"},
                    {"name": "Tapete grande (4-6m²)", "price": "R$ 80"},
                    {"name": "Carpete (por m²)", "price": "R$ 25"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "category": "Bancos Automotivos",
                "items": [
                    {"name": "Banco dianteiro - Tecido", "price": "R$ 40"},
                    {"name": "Banco dianteiro - Couro", "price": "R$ 60"},
                    {"name": "Banco traseiro - Tecido", "price": "R$ 60"},
                    {"name": "Banco traseiro - Couro", "price": "R$ 80"},
                    {"name": "Conjunto completo - Tecido", "price": "R$ 150"},
                    {"name": "Conjunto completo - Couro", "price": "R$ 200"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "category": "Cortinas",
                "items": [
                    {"name": "Cortina pequena (até 2m)", "price": "R$ 50"},
                    {"name": "Cortina média (2-3m)", "price": "R$ 70"},
                    {"name": "Cortina grande (3-4m)", "price": "R$ 90"},
                    {"name": "Persiana", "price": "R$ 40"}
                ],
                "active": True,
                "created_at": datetime.utcnow()
            }
        ]

        # Mock testimonials data
        mock_testimonials = [
            {
                "id": str(uuid.uuid4()),
                "name": "Maria Silva",
                "location": "Bertioga Centro",
                "rating": 5,
                "text": "Serviço impecável! Meu sofá ficou como novo. Super recomendo a TM Higienização!",
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "João Santos",
                "location": "Jardim Esmeralda",
                "rating": 5,
                "text": "Profissionais muito competentes. Fizeram a limpeza dos bancos do meu carro e ficou perfeito.",
                "active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Ana Costa",
                "location": "Vila Itapanhaú",
                "rating": 5,
                "text": "Atendimento excelente e preço justo. Já indiquei para várias amigas!",
                "active": True,
                "created_at": datetime.utcnow()
            }
        ]

        # Company info
        company_info = {
            "name": "TM Higienização",
            "location": "Bertioga - São Paulo",
            "phone": "(13) 99704-3410",
            "whatsapp": "5513997043410",
            "email": "contato@tmhigienizacao.com.br",
            "address": "Bertioga, São Paulo",
            "workingHours": "Segunda a Sábado: 8h às 18h"
        }

        # Insert all data
        await db.services.insert_many(mock_services)
        await db.pricing.insert_many(mock_pricing)
        await db.testimonials.insert_many(mock_testimonials)
        await db.company_info.insert_one(company_info)

        return {
            "message": "Database seeded successfully",
            "inserted": {
                "services": len(mock_services),
                "pricing_categories": len(mock_pricing),
                "testimonials": len(mock_testimonials),
                "company_info": 1
            }
        }
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise HTTPException(status_code=500, detail="Failed to seed database")


# Legacy routes (keeping for compatibility)
@api_router.get("/")
async def root():
    return {"message": "TM Higienização API - Ready to serve!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
