from typing import List, Optional, Dict, Union
from fastapi import FastAPI, Request
from pydantic import BaseModel
import time
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
    cursor.execute("""CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL)""")
    cursor.execute("INSERT INTO users (name) VALUES ('Alice')")
    cursor.execute("INSERT INTO users (name) VALUES ('Bob')")
    conn.commit()
    conn.close()


create_db_and_table()


@app.get("/get_body/{name}")
async def get_body(name: str, id: int):
    return name


@app.post("/post_body_all/{id}")
async def post_body_all(id: int, val1: str, val2: str, data: AdvancedUserModel):
    return data


@app.delete("/delete_body/{id}")
async def delete_body(id: int, data: Address):
    return data


@app.put("/put_body/{id}")
async def put_body(id: int, data: Address):
    return data


# @app.post("/sql_injection")
# async def sql_injection(data: Address):
#     return data

# @app.post("/xss_attack")
# async def xss_attack(data: AdvancedUserModel):
#     time.sleep(0.1)
#     return data

# @app.get("/sql_map")
# async def sql_map(data: Address):
#     print(data.city)
#     conn = sqlite3.connect("test.db")
#     cursor = conn.cursor()

#     query = f"SELECT * FROM users WHERE name = '{data.city}'"
#     try:
#         cursor.execute(query)
#         result = cursor.fetchall()
#     except Exception as e:
#         return {"error": str(e)}
#     finally:
#         conn.close()
#     return {"result": result}
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
