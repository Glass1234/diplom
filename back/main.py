from typing import Union
from fastapi import FastAPI, Request
from pydantic import BaseModel
import sqlite3
import json

app = FastAPI()

class InputData(BaseModel):
    first_name: str
    last_name: str
    age: int

def create_db_and_table():
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL)''')
    conn.commit()
    conn.close()

# # Уязвимость для SQL инъекции: выполняется небезопасный запрос
# @app.post("/sql_injection")
# async def sql_injection(request: Request):
#     body = await request.json()
#     user_input = body.get("input", "")

#     create_db_and_table()

#     conn = sqlite3.connect("test.db")
#     cursor = conn.cursor()
#     query = f"SELECT * FROM users WHERE name = '{user_input}'"  # Небезопасный запрос
#     cursor.execute(query)
#     result = cursor.fetchall()
#     conn.close()
#     return {"result": result}

# Уязвимость для XSS: неэкранированный вывод пользовательского ввода
@app.post("/xss_attack")
async def xss_attack(data: InputData):
    first_name = data.first_name
    last_name = data.last_name
    age = data.age
    return {"message": f"Hello, {first_name} {last_name}, {age} years old!"}

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
