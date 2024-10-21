import requests
from xssAttack.main import XssAttack
import pprint
import json

SHEMAS = {
    "InputData": {
        "properties": {
            "first_name": {"type": "string", "title": "First Name"},
            "last_name": {"type": "string", "title": "Last Name"},
            "age": {"type": "integer", "title": "Age"},
        },
        "type": "object",
        "required": ["first_name", "last_name", "age"],
        "title": "InputData",
    },
}
url = "http://127.0.0.1:8000/xss_attack"

genData = XssAttack().get(SHEMAS)
response = requests.post(url, json=genData)
print(XssAttack().check(genData, response.json()))