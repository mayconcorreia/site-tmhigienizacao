from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt
import hashlib
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="TM Higienização API", version="1.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")

# JWT Configuration
SECRET_KEY = "tm_higienizacao_secret_key_2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

# Security
security = HTTPBearer()

# Admin credentials (in production, store in database)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "tm123admin"  # In production, use hashed password

# Pydantic Models
class PricingItem(BaseModel):
    name: str
    price: str
    description: Optional[str] = None

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
    active: bool = True

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    active: Optional[bool] = None

class PricingCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    items: List[PricingItem]
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PricingCategoryCreate(BaseModel):
    category: str
    items: List[PricingItem]
    active: bool = True

class PricingCategoryUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[PricingItem]] = None
    active: Optional[bool] = None

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
    active: bool = True

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    text: Optional[str] = None
    active: Optional[bool] = None

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    service: Optional[str] = None
    message: str
    source: str = "form"  # 'whatsapp', 'form', 'phone'
    status: str = "pending"  # 'pending', 'contacted', 'converted', 'closed'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: Optional[str] = None
    message: str
    source: str = "form"

class ContactStatusUpdate(BaseModel):
    status: str

class CompanyInfo(BaseModel):
    name: str = "TM Higienização"
    location: str = "Bertioga - São Paulo"
    phone: str = "(13) 99704-3410"
    whatsapp: str = "5513997043410"
    email: str = "contato@tmhigienizacao.com.br"
    address: str = "Bertioga, São Paulo"
    workingHours: str = "Segunda a Sábado: 8h às 18h"

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Initialize database with mock data
async def init_database():
    try:
        # Check if data already exists
        services_count = await db.services.count_documents({})
        if services_count == 0:
            # Insert mock services
            mock_services = [
                {
                    "id": "1",
                    "title": "Sofás e Poltronas",
                    "description": "Higienização profunda com produtos específicos para cada tipo de tecido",
                    "icon": "Sofa",
                    "features": ["Remoção de manchas", "Eliminação de odores", "Proteção anti-ácaros"],
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "2",
                    "title": "Colchões e Travesseiros",
                    "description": "Limpeza especializada para um sono mais saudável",
                    "icon": "Bed",
                    "features": ["Aspiração profunda", "Sanitização completa", "Secagem rápida"],
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "3",
                    "title": "Tapetes e Carpetes",
                    "description": "Restauração da beleza original dos seus tapetes",
                    "icon": "Home",
                    "features": ["Lavagem com shampoo", "Remoção de pelos", "Impermeabilização"],
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "4",
                    "title": "Bancos Automotivos",
                    "description": "Cuidado especial para o interior do seu veículo",
                    "icon": "Car",
                    "features": ["Limpeza de couro", "Tecidos automotivos", "Proteção UV"],
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "5",
                    "title": "Cortinas",
                    "description": "Higienização sem retirar de casa",
                    "icon": "Sun",
                    "features": ["Limpeza no local", "Todos os tecidos", "Secagem natural"],
                    "active": True,
                    "created_at": datetime.utcnow()
                }
            ]
            await db.services.insert_many(mock_services)
            
            # Insert mock pricing
            mock_pricing = [
                {
                    "id": "1",
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
                    "id": "2",
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
                    "id": "3",
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
                    "id": "4",
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
                    "id": "5",
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
                    "id": "6",
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
            await db.pricing.insert_many(mock_pricing)
            
            # Insert mock testimonials
            mock_testimonials = [
                {
                    "id": "1",
                    "name": "Maria Silva",
                    "location": "Bertioga Centro",
                    "rating": 5,
                    "text": "Serviço impecável! Meu sofá ficou como novo. Super recomendo a TM Higienização!",
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "2",
                    "name": "João Santos",
                    "location": "Jardim Esmeralda",
                    "rating": 5,
                    "text": "Profissionais muito competentes. Fizeram a limpeza dos bancos do meu carro e ficou perfeito.",
                    "active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "id": "3",
                    "name": "Ana Costa",
                    "location": "Vila Itapanhaú",
                    "rating": 5,
                    "text": "Atendimento excelente e preço justo. Já indiquei para várias amigas!",
                    "active": True,
                    "created_at": datetime.utcnow()
                }
            ]
            await db.testimonials.insert_many(mock_testimonials)
            
            # Insert company info
            company_info = {
                "name": "TM Higienização",
                "location": "Bertioga - São Paulo",
                "phone": "(13) 99704-3410",
                "whatsapp": "5513997043410",
                "email": "contato@tmhigienizacao.com.br",
                "address": "Bertioga, São Paulo",
                "workingHours": "Segunda a Sábado: 8h às 18h"
            }
            await db.company_info.insert_one(company_info)
            
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")

# Public API Routes
@api_router.get("/")
async def root():
    return {"message": "TM Higienização API", "version": "1.0.0"}

@api_router.get("/services")
async def get_services():
    services = await db.services.find({"active": True}, {"_id": 0}).to_list(1000)
    return {"services": services}

@api_router.get("/pricing")
async def get_pricing():
    pricing = await db.pricing.find({"active": True}, {"_id": 0}).to_list(1000)
    return {"pricing": pricing}

@api_router.get("/testimonials")
async def get_testimonials():
    testimonials = await db.testimonials.find({"active": True}, {"_id": 0}).to_list(1000)
    return {"testimonials": testimonials}

@api_router.get("/company-info")
async def get_company_info():
    company = await db.company_info.find_one({}, {"_id": 0})
    if not company:
        # Return default
        company = {
            "name": "TM Higienização",
            "location": "Bertioga - São Paulo",
            "phone": "(13) 99704-3410",
            "whatsapp": "5513997043410",
            "email": "contato@tmhigienizacao.com.br",
            "address": "Bertioga, São Paulo",
            "workingHours": "Segunda a Sábado: 8h às 18h"
        }
    return {"company": company}

@api_router.post("/contact")
async def create_contact(contact_data: ContactCreate):
    contact_dict = contact_data.dict()
    contact_obj = Contact(**contact_dict)
    result = await db.contacts.insert_one(contact_obj.dict())
    
    return {
        "success": True,
        "message": "Contato recebido com sucesso",
        "contact_id": contact_obj.id
    }

# Admin Authentication Routes
@admin_router.post("/login", response_model=Token)
async def admin_login(credentials: AdminLogin):
    # Simple authentication (in production, use proper password hashing)
    if credentials.username != ADMIN_USERNAME or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": credentials.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@admin_router.get("/verify")
async def verify_admin_token(current_user: str = Depends(verify_token)):
    return {"valid": True, "user": current_user}

# Admin Services Management
@admin_router.get("/services")
async def admin_get_services(current_user: str = Depends(verify_token)):
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    return {"services": services}

@admin_router.post("/services", response_model=Service)
async def admin_create_service(service_data: ServiceCreate, current_user: str = Depends(verify_token)):
    service_dict = service_data.dict()
    service_obj = Service(**service_dict)
    await db.services.insert_one(service_obj.dict())
    return service_obj

@admin_router.put("/services/{service_id}")
async def admin_update_service(service_id: str, service_data: ServiceUpdate, current_user: str = Depends(verify_token)):
    update_data = {k: v for k, v in service_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.services.update_one({"id": service_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    updated_service = await db.services.find_one({"id": service_id})
    return {"success": True, "service": updated_service}

@admin_router.delete("/services/{service_id}")
async def admin_delete_service(service_id: str, current_user: str = Depends(verify_token)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"success": True, "message": "Service deleted"}

# Admin Pricing Management
@admin_router.get("/pricing")
async def admin_get_pricing(current_user: str = Depends(verify_token)):
    pricing = await db.pricing.find({}, {"_id": 0}).to_list(1000)
    return {"pricing": pricing}

@admin_router.post("/pricing", response_model=PricingCategory)
async def admin_create_pricing(pricing_data: PricingCategoryCreate, current_user: str = Depends(verify_token)):
    pricing_dict = pricing_data.dict()
    pricing_obj = PricingCategory(**pricing_dict)
    await db.pricing.insert_one(pricing_obj.dict())
    return pricing_obj

@admin_router.put("/pricing/{pricing_id}")
async def admin_update_pricing(pricing_id: str, pricing_data: PricingCategoryUpdate, current_user: str = Depends(verify_token)):
    update_data = {k: v for k, v in pricing_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.pricing.update_one({"id": pricing_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pricing category not found")
    
    updated_pricing = await db.pricing.find_one({"id": pricing_id})
    return {"success": True, "pricing": updated_pricing}

@admin_router.delete("/pricing/{pricing_id}")
async def admin_delete_pricing(pricing_id: str, current_user: str = Depends(verify_token)):
    result = await db.pricing.delete_one({"id": pricing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pricing category not found")
    return {"success": True, "message": "Pricing category deleted"}

# Admin Testimonials Management
@admin_router.get("/testimonials")
async def admin_get_testimonials(current_user: str = Depends(verify_token)):
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(1000)
    return {"testimonials": testimonials}

@admin_router.post("/testimonials", response_model=Testimonial)
async def admin_create_testimonial(testimonial_data: TestimonialCreate, current_user: str = Depends(verify_token)):
    testimonial_dict = testimonial_data.dict()
    testimonial_obj = Testimonial(**testimonial_dict)
    await db.testimonials.insert_one(testimonial_obj.dict())
    return testimonial_obj

@admin_router.put("/testimonials/{testimonial_id}")
async def admin_update_testimonial(testimonial_id: str, testimonial_data: TestimonialUpdate, current_user: str = Depends(verify_token)):
    update_data = {k: v for k, v in testimonial_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return {"success": True, "testimonial": updated_testimonial}

@admin_router.delete("/testimonials/{testimonial_id}")
async def admin_delete_testimonial(testimonial_id: str, current_user: str = Depends(verify_token)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"success": True, "message": "Testimonial deleted"}

# Admin Company Info Management
@admin_router.get("/company-info")
async def admin_get_company_info(current_user: str = Depends(verify_token)):
    company = await db.company_info.find_one()
    return {"company": company}

@admin_router.put("/company-info")
async def admin_update_company_info(company_data: CompanyInfo, current_user: str = Depends(verify_token)):
    await db.company_info.replace_one({}, company_data.dict(), upsert=True)
    updated_company = await db.company_info.find_one()
    return {"success": True, "company": updated_company}

# Admin Contacts Management
@admin_router.get("/contacts")
async def admin_get_contacts(current_user: str = Depends(verify_token)):
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return {"contacts": contacts}

@admin_router.put("/contacts/{contact_id}/status")
async def admin_update_contact_status(contact_id: str, status_data: ContactStatusUpdate, current_user: str = Depends(verify_token)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status_data.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    updated_contact = await db.contacts.find_one({"id": contact_id})
    return {"success": True, "contact": updated_contact}

@admin_router.delete("/contacts/{contact_id}")
async def admin_delete_contact(contact_id: str, current_user: str = Depends(verify_token)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"success": True, "message": "Contact deleted"}

# Include routers
app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
