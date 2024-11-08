from typing import List, Optional, Dict, Union
from fastapi import FastAPI, Request
from pydantic import BaseModel
import sqlite3
import json

app = FastAPI()

class Address(BaseModel):
    street: str
    city: str
    postal_code: str

class UserModel(BaseModel):
    name: str
    age: int
    email: str
    addresses: List[Address]

class Contact(BaseModel):
    phone: str
    email: str

class AdvancedUserModel(BaseModel):
    full_name: str
    age: int
    is_active: bool
    rating: float
    addresses: List[Address]
    contacts: List[Contact]
    additional_data: Optional[Address] = None

def create_db_and_table():
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL)''')
    conn.commit()
    conn.close()

# Уязвимость для SQL инъекции: выполняется небезопасный запрос
@app.post("/sql_injection")
async def sql_injection(data: Address):
    print(data)
    return {"result": data}

# Уязвимость для XSS: неэкранированный вывод пользовательского ввода
@app.post("/xss_attack")
async def xss_attack(data: AdvancedUserModel):
    print(data)
    return {"message": data}

# # Уязвимость для Injections Other Than SQL: неподходящая обработка данных
# @app.post("/other_injections")
# async def other_injections(request: Request):
#     body = await request.json()
#     user_input = body.get("input", "")
#     # Здесь может быть уязвимость для различных инъекций через обработку входных данных
#     processed_input = eval(user_input)  # Опасная функция eval
#     return {"processed": processed_input}

# # Уязвимость для Rate Limiting Bypass: нет ограничения на количество запросов
# @app.post("/rate_limiting_bypass")
# async def rate_limiting_bypass(request: Request):
#     body = await request.json()
#     return {"message": "Request accepted", "body": body}  # Отсутствие rate limiting

# # Уязвимость для NoSQL инъекции: неподходящая обработка запроса в NoSQL базе
# @app.post("/nosql_injection")
# async def nosql_injection(request: Request):
#     body = await request.json()
#     user_input = body.get("input", {})
#     # Пример уязвимости в MongoDB
#     query = {"name": user_input}  # Небезопасный запрос для NoSQL
#     return {"query": query}
