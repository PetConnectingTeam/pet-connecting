import requests

def verify_address(address):
    url = f"https://nominatim.openstreetmap.org/search?q={address}&format=json&addressdetails=1"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return False, "Request error"
    except ValueError as e:
        print(f"JSON decode error: {e}")
        return False, "Invalid JSON response"

    if len(data) > 0:
        return True, data[0]['display_name']
    else:
        return False, "Address not found"