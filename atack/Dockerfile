# Используем базовый образ с Node.js
FROM node:lts

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash

# Добавляем путь Bun в $PATH
ENV PATH="/root/.bun/bin:$PATH"

# Устанавливаем Python и необходимые зависимости
RUN apt-get update && apt-get install -y python3 python3-pip git python3-venv

# Клонируем репозиторий sqlmap на уровень выше вашего проекта
RUN git clone https://github.com/sqlmapproject/sqlmap /sqlmap

# Создаём виртуальное окружение (если нужно для других Python-зависимостей)
RUN python3 -m venv /venv && /venv/bin/pip install --upgrade pip

# Добавляем путь виртуального окружения в PATH
ENV PATH="/venv/bin:$PATH"

# Копируем ваш проект внутрь контейнера
WORKDIR /app
COPY . .

# Устанавливаем зависимости проекта
RUN bun install

# Открываем порт для взаимодействия (если нужно)
EXPOSE 8000

# Команда запуска вашего проекта
CMD ["bun", "run", "--watch", "."]
