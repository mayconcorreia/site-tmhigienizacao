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
        
        if response_data:
            print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
    
    def test_health_check(self):
        """Test basic health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Health Check", True, "API is responding", data)
                    return True
                else:
                    self.log_result("Health Check", False, "Invalid response format", data)
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_seed_database(self):
        """Test database seeding endpoint"""
        try:
            response = requests.post(f"{API_BASE}/seed-data", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Database Seeding", True, data["message"], data)
                    return True
                else:
                    self.log_result("Database Seeding", False, "Invalid response format", data)
            else:
                self.log_result("Database Seeding", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Database Seeding", False, f"Error: {str(e)}")
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
                            self.log_result("GET Services", True, f"Retrieved {len(services)} services", {"count": len(services)})
                            return True
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
                                    self.log_result("GET Pricing", True, f"Retrieved {len(pricing)} pricing categories", {"count": len(pricing)})
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
                                self.log_result("GET Testimonials", True, f"Retrieved {len(testimonials)} testimonials", {"count": len(testimonials)})
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
                            self.log_result("GET Company Info", True, "Company information retrieved successfully", company)
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
                "name": "Carlos Eduardo Silva",
                "phone": "(13) 98765-4321",
                "email": "carlos.silva@email.com",
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
                        self.log_result("POST Contact", True, "Contact created successfully", data)
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
    
    def test_legacy_status_endpoints(self):
        """Test legacy status endpoints for compatibility"""
        try:
            # Test GET /api/status
            response = requests.get(f"{API_BASE}/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("GET Status (Legacy)", True, f"Retrieved {len(data)} status checks")
                else:
                    self.log_result("GET Status (Legacy)", False, "Invalid response format")
            else:
                self.log_result("GET Status (Legacy)", False, f"Status code: {response.status_code}")
            
            # Test POST /api/status
            status_data = {"client_name": "Test Client"}
            response = requests.post(f"{API_BASE}/status", 
                                   json=status_data,
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "client_name" in data:
                    self.log_result("POST Status (Legacy)", True, "Status check created", data)
                    return True
                else:
                    self.log_result("POST Status (Legacy)", False, "Invalid response structure")
            else:
                self.log_result("POST Status (Legacy)", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Legacy Status Endpoints", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("TM HIGIENIZAÇÃO BACKEND API TESTING")
        print("=" * 60)
        print(f"Testing backend at: {API_BASE}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)
        
        # Test in logical order
        tests = [
            ("Health Check", self.test_health_check),
            ("Database Seeding", self.test_seed_database),
            ("GET Services", self.test_get_services),
            ("GET Pricing", self.test_get_pricing),
            ("GET Testimonials", self.test_get_testimonials),
            ("GET Company Info", self.test_get_company_info),
            ("POST Contact", self.test_post_contact),
            ("Legacy Status Endpoints", self.test_legacy_status_endpoints)
        ]
        
        for test_name, test_func in tests:
            print(f"\n🧪 Running: {test_name}")
            test_func()
        
        # Print summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
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