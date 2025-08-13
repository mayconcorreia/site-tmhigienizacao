#!/usr/bin/env python3
"""
TM Higienização Backend API Testing Suite
Tests all backend endpoints for the cleaning service application
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}")

class BackendTester:
    def __init__(self):
        self.results = {
            'total_tests': 0,
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        self.admin_token = None
    
    def log_result(self, test_name, success, message="", response_data=None):
        """Log test result"""
        self.results['total_tests'] += 1
        if success:
            self.results['passed'] += 1
            print(f"✅ {test_name}: {message}")
        else:
            self.results['failed'] += 1
            self.results['errors'].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: {message}")
        
        if response_data and isinstance(response_data, dict):
            # Truncate long responses for readability
            response_str = json.dumps(response_data, indent=2, default=str)
            if len(response_str) > 300:
                response_str = response_str[:300] + "..."
            print(f"   Response: {response_str}")
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    if data["message"] == "TM Higienização API":
                        self.log_result("Health Check", True, "API is responding correctly", data)
                        return True
                    else:
                        self.log_result("Health Check", False, f"Unexpected message: {data['message']}", data)
                else:
                    self.log_result("Health Check", False, "Missing required fields in response", data)
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_admin_login(self):
        """Test admin login endpoint"""
        try:
            login_data = {
                "username": "admin",
                "password": "tm123admin"
            }
            
            response = requests.post(f"{API_BASE}/admin/login", 
                                   json=login_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    if data["token_type"] == "bearer":
                        self.admin_token = data["access_token"]
                        self.log_result("Admin Login", True, "Login successful, token received")
                        return True
                    else:
                        self.log_result("Admin Login", False, f"Unexpected token type: {data['token_type']}")
                else:
                    self.log_result("Admin Login", False, "Missing token fields in response", data)
            else:
                self.log_result("Admin Login", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin Login", False, f"Error: {str(e)}")
        return False
    
    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        try:
            login_data = {
                "username": "admin",
                "password": "wrongpassword"
            }
            
            response = requests.post(f"{API_BASE}/admin/login", 
                                   json=login_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 401:
                self.log_result("Admin Login (Invalid)", True, "Correctly rejected invalid credentials")
                return True
            else:
                self.log_result("Admin Login (Invalid)", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Admin Login (Invalid)", False, f"Error: {str(e)}")
        return False
    
    def test_admin_verify_token(self):
        """Test admin token verification"""
        if not self.admin_token:
            self.log_result("Admin Token Verify", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{API_BASE}/admin/verify", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "valid" in data and "user" in data:
                    if data["valid"] is True and data["user"] == "admin":
                        self.log_result("Admin Token Verify", True, "Token verification successful", data)
                        return True
                    else:
                        self.log_result("Admin Token Verify", False, "Invalid token verification response", data)
                else:
                    self.log_result("Admin Token Verify", False, "Missing fields in response", data)
            else:
                self.log_result("Admin Token Verify", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin Token Verify", False, f"Error: {str(e)}")
        return False
    
    def test_get_services(self):
        """Test GET /api/services endpoint"""
        try:
            response = requests.get(f"{API_BASE}/services", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "services" in data and isinstance(data["services"], list):
                    services = data["services"]
                    if len(services) > 0:
                        # Validate service structure
                        service = services[0]
                        required_fields = ["id", "title", "description", "icon", "features", "active"]
                        if all(field in service for field in required_fields):
                            # Check if features is a list
                            if isinstance(service["features"], list):
                                self.log_result("GET Services", True, f"Retrieved {len(services)} services", {"count": len(services), "first_service": service["title"]})
                                return True
                            else:
                                self.log_result("GET Services", False, "Features field is not a list")
                        else:
                            missing = [f for f in required_fields if f not in service]
                            self.log_result("GET Services", False, f"Missing fields: {missing}")
                    else:
                        self.log_result("GET Services", False, "No services returned")
                else:
                    self.log_result("GET Services", False, "Invalid response structure", data)
            else:
                self.log_result("GET Services", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("GET Services", False, f"Error: {str(e)}")
        return False
    
    def test_get_pricing(self):
        """Test GET /api/pricing endpoint"""
        try:
            response = requests.get(f"{API_BASE}/pricing", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "pricing" in data and isinstance(data["pricing"], list):
                    pricing = data["pricing"]
                    if len(pricing) > 0:
                        # Validate pricing structure
                        category = pricing[0]
                        required_fields = ["id", "category", "items", "active"]
                        if all(field in category for field in required_fields):
                            # Validate items structure
                            if len(category["items"]) > 0:
                                item = category["items"][0]
                                item_fields = ["name", "price"]
                                if all(field in item for field in item_fields):
                                    self.log_result("GET Pricing", True, f"Retrieved {len(pricing)} pricing categories", {"count": len(pricing), "first_category": category["category"]})
                                    return True
                                else:
                                    self.log_result("GET Pricing", False, "Invalid item structure")
                            else:
                                self.log_result("GET Pricing", False, "No items in pricing category")
                        else:
                            missing = [f for f in required_fields if f not in category]
                            self.log_result("GET Pricing", False, f"Missing fields: {missing}")
                    else:
                        self.log_result("GET Pricing", False, "No pricing categories returned")
                else:
                    self.log_result("GET Pricing", False, "Invalid response structure", data)
            else:
                self.log_result("GET Pricing", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("GET Pricing", False, f"Error: {str(e)}")
        return False
    
    def test_get_testimonials(self):
        """Test GET /api/testimonials endpoint"""
        try:
            response = requests.get(f"{API_BASE}/testimonials", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "testimonials" in data and isinstance(data["testimonials"], list):
                    testimonials = data["testimonials"]
                    if len(testimonials) > 0:
                        # Validate testimonial structure
                        testimonial = testimonials[0]
                        required_fields = ["id", "name", "location", "rating", "text", "active"]
                        if all(field in testimonial for field in required_fields):
                            # Validate rating is between 1-5
                            if 1 <= testimonial["rating"] <= 5:
                                self.log_result("GET Testimonials", True, f"Retrieved {len(testimonials)} testimonials", {"count": len(testimonials), "first_name": testimonial["name"]})
                                return True
                            else:
                                self.log_result("GET Testimonials", False, f"Invalid rating: {testimonial['rating']}")
                        else:
                            missing = [f for f in required_fields if f not in testimonial]
                            self.log_result("GET Testimonials", False, f"Missing fields: {missing}")
                    else:
                        self.log_result("GET Testimonials", False, "No testimonials returned")
                else:
                    self.log_result("GET Testimonials", False, "Invalid response structure", data)
            else:
                self.log_result("GET Testimonials", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("GET Testimonials", False, f"Error: {str(e)}")
        return False
    
    def test_get_company_info(self):
        """Test GET /api/company-info endpoint"""
        try:
            response = requests.get(f"{API_BASE}/company-info", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "company" in data:
                    company = data["company"]
                    required_fields = ["name", "location", "phone", "whatsapp", "email", "address", "workingHours"]
                    if all(field in company for field in required_fields):
                        # Validate specific values
                        if company["name"] == "TM Higienização":
                            self.log_result("GET Company Info", True, "Company information retrieved successfully", {"name": company["name"], "location": company["location"]})
                            return True
                        else:
                            self.log_result("GET Company Info", False, f"Unexpected company name: {company['name']}")
                    else:
                        missing = [f for f in required_fields if f not in company]
                        self.log_result("GET Company Info", False, f"Missing fields: {missing}")
                else:
                    self.log_result("GET Company Info", False, "Invalid response structure", data)
            else:
                self.log_result("GET Company Info", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("GET Company Info", False, f"Error: {str(e)}")
        return False
    
    def test_post_contact(self):
        """Test POST /api/contact endpoint"""
        try:
            # Test data with realistic Brazilian names and phone
            contact_data = {
                "name": "Maria Santos",
                "phone": "(13) 98765-4321",
                "email": "maria.santos@email.com",
                "service": "Sofás e Poltronas",
                "message": "Gostaria de um orçamento para limpeza do meu sofá de 3 lugares. Quando vocês podem vir fazer uma avaliação?",
                "source": "form"
            }
            
            response = requests.post(f"{API_BASE}/contact", 
                                   json=contact_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["success", "message", "contact_id"]
                if all(field in data for field in required_fields):
                    if data["success"] is True:
                        self.log_result("POST Contact", True, "Contact created successfully", {"contact_id": data["contact_id"]})
                        return True
                    else:
                        self.log_result("POST Contact", False, "Success flag is false")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("POST Contact", False, f"Missing fields: {missing}")
            else:
                self.log_result("POST Contact", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("POST Contact", False, f"Error: {str(e)}")
        return False
    
    def test_admin_get_services(self):
        """Test admin GET /api/admin/services endpoint"""
        if not self.admin_token:
            self.log_result("Admin GET Services", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{API_BASE}/admin/services", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "services" in data and isinstance(data["services"], list):
                    services = data["services"]
                    self.log_result("Admin GET Services", True, f"Retrieved {len(services)} services (including inactive)", {"count": len(services)})
                    return True
                else:
                    self.log_result("Admin GET Services", False, "Invalid response structure", data)
            else:
                self.log_result("Admin GET Services", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin GET Services", False, f"Error: {str(e)}")
        return False
    
    def test_admin_get_contacts(self):
        """Test admin GET /api/admin/contacts endpoint"""
        if not self.admin_token:
            self.log_result("Admin GET Contacts", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{API_BASE}/admin/contacts", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "contacts" in data and isinstance(data["contacts"], list):
                    contacts = data["contacts"]
                    self.log_result("Admin GET Contacts", True, f"Retrieved {len(contacts)} contacts", {"count": len(contacts)})
                    return True
                else:
                    self.log_result("Admin GET Contacts", False, "Invalid response structure", data)
            else:
                self.log_result("Admin GET Contacts", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin GET Contacts", False, f"Error: {str(e)}")
        return False
    
    def test_admin_get_testimonials(self):
        """Test admin GET /api/admin/testimonials endpoint"""
        if not self.admin_token:
            self.log_result("Admin GET Testimonials", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = requests.get(f"{API_BASE}/admin/testimonials", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "testimonials" in data and isinstance(data["testimonials"], list):
                    testimonials = data["testimonials"]
                    self.log_result("Admin GET Testimonials", True, f"Retrieved {len(testimonials)} testimonials (including inactive)", {"count": len(testimonials)})
                    return True
                else:
                    self.log_result("Admin GET Testimonials", False, "Invalid response structure", data)
            else:
                self.log_result("Admin GET Testimonials", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin GET Testimonials", False, f"Error: {str(e)}")
        return False
    
    def test_admin_create_service(self):
        """Test admin POST /api/admin/services endpoint"""
        if not self.admin_token:
            self.log_result("Admin Create Service", False, "No admin token available")
            return False
        
        try:
            service_data = {
                "title": "Teste de Serviço",
                "description": "Serviço criado durante teste automatizado",
                "icon": "TestIcon",
                "features": ["Teste 1", "Teste 2", "Teste 3"],
                "active": True
            }
            
            headers = {
                "Authorization": f"Bearer {self.admin_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(f"{API_BASE}/admin/services", 
                                   json=service_data, 
                                   headers=headers,
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "title", "description", "icon", "features", "active"]
                if all(field in data for field in required_fields):
                    if data["title"] == service_data["title"]:
                        self.log_result("Admin Create Service", True, "Service created successfully", {"id": data["id"], "title": data["title"]})
                        return True
                    else:
                        self.log_result("Admin Create Service", False, "Service title mismatch")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Admin Create Service", False, f"Missing fields: {missing}")
            else:
                self.log_result("Admin Create Service", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Admin Create Service", False, f"Error: {str(e)}")
        return False
    
    def test_unauthorized_admin_access(self):
        """Test that admin endpoints require authentication"""
        try:
            # Try to access admin services without token
            response = requests.get(f"{API_BASE}/admin/services", timeout=10)
            
            if response.status_code in [401, 403]:
                self.log_result("Unauthorized Admin Access", True, f"Correctly blocked unauthorized access (status: {response.status_code})")
                return True
            else:
                self.log_result("Unauthorized Admin Access", False, f"Expected 401 or 403, got {response.status_code}")
        except Exception as e:
            self.log_result("Unauthorized Admin Access", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 70)
        print("TM HIGIENIZAÇÃO BACKEND API TESTING")
        print("=" * 70)
        print(f"Testing backend at: {API_BASE}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 70)
        
        # Test in logical order
        tests = [
            ("1. Health Check", self.test_health_check),
            ("2. Admin Login", self.test_admin_login),
            ("3. Admin Login (Invalid)", self.test_admin_login_invalid),
            ("4. Admin Token Verify", self.test_admin_verify_token),
            ("5. GET Services", self.test_get_services),
            ("6. GET Pricing", self.test_get_pricing),
            ("7. GET Testimonials", self.test_get_testimonials),
            ("8. GET Company Info", self.test_get_company_info),
            ("9. POST Contact", self.test_post_contact),
            ("10. Admin GET Services", self.test_admin_get_services),
            ("11. Admin GET Contacts", self.test_admin_get_contacts),
            ("12. Admin GET Testimonials", self.test_admin_get_testimonials),
            ("13. Admin Create Service", self.test_admin_create_service),
            ("14. Unauthorized Admin Access", self.test_unauthorized_admin_access)
        ]
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running: {test_name}")
            test_func()
        
        # Print summary
        print("\n" + "=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']}")
        print(f"Failed: {self.results['failed']}")
        
        if self.results['failed'] > 0:
            print("\nFAILED TESTS:")
            for error in self.results['errors']:
                print(f"  ❌ {error}")
        
        success_rate = (self.results['passed'] / self.results['total_tests']) * 100 if self.results['total_tests'] > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)