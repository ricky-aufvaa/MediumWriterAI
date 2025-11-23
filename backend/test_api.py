"""
Test script for the FastAPI Article Writing System
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on localhost:8000")
        return False

def test_system_info():
    """Test the system info endpoint"""
    print("\n🔍 Testing system info...")
    try:
        response = requests.get(f"{BASE_URL}/system-info")
        if response.status_code == 200:
            print("✅ System info retrieved successfully")
            info = response.json()
            print(f"   System: {info.get('system')}")
            print(f"   Version: {info.get('version')}")
            print(f"   Model: {info.get('model')}")
        else:
            print(f"❌ System info failed: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error getting system info: {e}")
        return False

def test_article_generation():
    """Test the article generation endpoint"""
    print("\n🔍 Testing article generation...")
    
    test_data = {
        "article_name": "Test Article: Introduction to Python",
        "article_description": "A brief introduction to Python programming language, covering basic syntax, data types, and simple examples."
    }
    
    try:
        print("   Sending request...")
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/generate-article",
            json=test_data,
            timeout=120  # 2 minutes timeout
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        if response.status_code == 200:
            print(f"✅ Article generated successfully in {duration:.2f} seconds")
            result = response.json()
            print(f"   Quality Score: {result.get('quality_score')}/10")
            print(f"   Iterations: {result.get('iteration_count')}")
            print(f"   Article Length: {len(result.get('article_content', ''))} characters")
            print(f"   Success: {result.get('success')}")
            
            # Show first 200 characters of the article
            article_preview = result.get('article_content', '')[:200]
            print(f"   Article Preview: {article_preview}...")
            
        else:
            print(f"❌ Article generation failed: {response.status_code}")
            print(f"   Error: {response.text}")
            
        return response.status_code == 200
        
    except requests.exceptions.Timeout:
        print("❌ Request timed out (>2 minutes)")
        return False
    except Exception as e:
        print(f"❌ Error generating article: {e}")
        return False

def test_validation():
    """Test input validation"""
    print("\n🔍 Testing input validation...")
    
    # Test empty article name
    test_data = {
        "article_name": "",
        "article_description": "Valid description"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/generate-article", json=test_data)
        if response.status_code == 400:
            print("✅ Empty article name validation works")
        else:
            print(f"❌ Expected 400 for empty name, got {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
        return False
    
    # Test too long article name
    test_data = {
        "article_name": "x" * 250,  # Too long
        "article_description": "Valid description"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/generate-article", json=test_data)
        if response.status_code == 400:
            print("✅ Long article name validation works")
        else:
            print(f"❌ Expected 400 for long name, got {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing validation: {e}")
        return False
    
    return True

def test_test_endpoint():
    """Test the test generation endpoint"""
    print("\n🔍 Testing test generation endpoint...")
    
    try:
        response = requests.post(f"{BASE_URL}/test-generation", timeout=120)
        if response.status_code == 200:
            print("✅ Test generation endpoint works")
            result = response.json()
            print(f"   Generated article about: FastAPI")
            print(f"   Quality Score: {result.get('quality_score')}/10")
        else:
            print(f"❌ Test generation failed: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing test endpoint: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Article Writing System API Tests")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("System Info", test_system_info),
        ("Input Validation", test_validation),
        ("Test Endpoint", test_test_endpoint),
        ("Article Generation", test_article_generation),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the server logs and configuration.")

if __name__ == "__main__":
    main()
