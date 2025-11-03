#!/usr/bin/env python3
"""
API Test Script - Test all endpoints
Run this to verify the API is working correctly
"""

import requests
import json
from datetime import datetime

# Configure this URL
API_URL = "http://localhost:5000"  # Change to Azure URL when deployed

def print_section(title):
    """Print a section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health_check():
    """Test the health check endpoint"""
    print_section("Testing Health Check")

    try:
        response = requests.get(f"{API_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Health check passed!")
        else:
            print("❌ Health check failed!")

        return response.status_code == 200

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_insights():
    """Test the insights endpoint"""
    print_section("Testing Get Insights")

    try:
        start_time = datetime.now()
        response = requests.get(f"{API_URL}/api/insights")
        elapsed = (datetime.now() - start_time).total_seconds()

        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {elapsed:.2f}s")

        if response.status_code == 200:
            data = response.json()

            print("\n📊 Data Summary:")
            print(f"  - Total Recipes: {data.get('total_recipes')}")
            print(f"  - Diet Types: {data.get('diet_types')}")
            print(f"  - Status: {data.get('processing_status')}")

            print("\n📈 Average Macronutrients:")
            for item in data.get('average_macronutrients', []):
                print(f"  - {item['Diet_type']}: "
                      f"Protein={item['Protein(g)']:.1f}g, "
                      f"Carbs={item['Carbs(g)']:.1f}g, "
                      f"Fat={item['Fat(g)']:.1f}g")

            print("\n🥧 Diet Distribution:")
            dist = data.get('diet_distribution', {})
            for label, value in zip(dist.get('labels', []), dist.get('values', [])):
                print(f"  - {label}: {value} recipes")

            print("\n📊 Scatter Data Points:")
            scatter = data.get('protein_carbs_scatter', [])
            for diet_data in scatter:
                print(f"  - {diet_data['diet_type']}: {len(diet_data['data'])} data points")

            print("\n🔥 Correlation Matrix:")
            heatmap = data.get('correlation_heatmap', {})
            labels = heatmap.get('labels', [])
            matrix = heatmap.get('data', [])
            print(f"  - Labels: {labels}")
            print(f"  - Matrix: {len(matrix)}x{len(matrix[0]) if matrix else 0}")

            print("\n✅ Insights endpoint passed!")
            return True
        else:
            print(f"❌ Insights endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_recipes():
    """Test the recipes endpoint"""
    print_section("Testing Get Recipes")

    try:
        start_time = datetime.now()
        response = requests.get(f"{API_URL}/api/recipes")
        elapsed = (datetime.now() - start_time).total_seconds()

        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {elapsed:.2f}s")

        if response.status_code == 200:
            data = response.json()
            recipes = data.get('recipes', [])
            total = data.get('total', 0)

            print(f"\n📚 Total Recipes: {total}")
            print(f"📦 Recipes Returned: {len(recipes)}")

            print("\n🥇 Top 5 Protein-Rich Recipes:")
            for i, recipe in enumerate(recipes[:5], 1):
                print(f"  {i}. {recipe['Recipe_name']}")
                print(f"     Diet: {recipe['Diet_type']}, "
                      f"Cuisine: {recipe['Cuisine_type']}")
                print(f"     Protein: {recipe['Protein(g)']:.1f}g, "
                      f"Carbs: {recipe['Carbs(g)']:.1f}g, "
                      f"Fat: {recipe['Fat(g)']:.1f}g")

            # Check data quality
            if len(recipes) == total:
                print(f"\n✅ All {total} recipes returned correctly!")
            else:
                print(f"\n⚠️  Expected {total} recipes, got {len(recipes)}")

            return True
        else:
            print(f"❌ Recipes endpoint failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_cors():
    """Test CORS headers"""
    print_section("Testing CORS Configuration")

    try:
        # Send OPTIONS request (preflight)
        response = requests.options(
            f"{API_URL}/api/insights",
            headers={
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET'
            }
        )

        print(f"Status Code: {response.status_code}")
        print(f"\nCORS Headers:")
        for header, value in response.headers.items():
            if 'Access-Control' in header or 'access-control' in header.lower():
                print(f"  - {header}: {value}")

        # Check if CORS is properly configured
        has_cors = any('Access-Control' in h for h in response.headers.keys())

        if has_cors:
            print("\n✅ CORS is configured!")
        else:
            print("\n⚠️  CORS headers not found - frontend may have issues")

        return has_cors

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  API Test Suite")
    print("  Testing:", API_URL)
    print("="*60)

    results = {}

    # Run tests
    results['health'] = test_health_check()
    results['insights'] = test_insights()
    results['recipes'] = test_recipes()
    results['cors'] = test_cors()

    # Summary
    print_section("Test Summary")

    passed = sum(results.values())
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name.capitalize()}: {status}")

    print(f"\n📊 Results: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! API is ready!")
    else:
        print("\n⚠️  Some tests failed. Please review the errors above.")

    return passed == total

if __name__ == "__main__":
    # You can change the API URL here for testing Azure deployment
    # API_URL = "https://your-function-app.azurewebsites.net"

    success = main()
    exit(0 if success else 1)
