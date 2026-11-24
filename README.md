# Лабораторная работа №7

**Вариант 2. Тема «Товары» (каталог с фильтрацией по цене)**

REST API для управления каталогом товаров на **FastAPI** с хранением данных в **SQLite** через **SQLAlchemy**. Реализованы все CRUD-операции, фильтрация по цене и валидация входных данных.

---

## Технологии

| Компонент | Версия | Назначение |
|---|---|---|
| Python | 3.10+ | Язык |
| FastAPI | 0.115.0 | Веб-фреймворк |
| SQLAlchemy | 2.0.35 | ORM |
| Pydantic | 2.9.2 | Валидация схем |
| SQLite | встроенная | База данных |
| Uvicorn | 0.30.6 | ASGI-сервер |

---

## Структура проекта

```
lab7/
├── main.py            # FastAPI-приложение, маршруты (CRUD)
├── database.py        # Подключение к SQLite, SessionLocal, Base
├── models.py          # ORM-модель Product
├── schemas.py         # Pydantic-схемы (валидация)
├── requirements.txt   # Зависимости
├── products.db        # Файл БД (создаётся автоматически)
└── README.md
```

---

## Установка и запуск

### 1. Клонировать проект / перейти в папку

```bash
cd lab7
```

### 2. Создать виртуальное окружение (рекомендуется)

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### 4. Запустить сервер

```bash
uvicorn main:app --reload
```

Сервер будет доступен по адресу: **http://127.0.0.1:8000**

- Swagger UI → http://127.0.0.1:8000/docs
- ReDoc → http://127.0.0.1:8000/redoc

Файл базы данных `products.db` создаётся автоматически при первом запуске.

---

## Модель данных

Таблица **products**:

| Поле | Тип | Ограничения |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `name` | TEXT | NOT NULL |
| `price` | REAL | NOT NULL, `>= 0` |
| `stock` | INTEGER | NOT NULL, `>= 0` |

---

## API-эндпоинты

| Метод | Путь | Описание | Успех |
|---|---|---|---|
| `GET` | `/api/products` | Список товаров (с фильтрацией по цене) | `200` |
| `POST` | `/api/products` | Создать товар | `201` |
| `PATCH` | `/api/products/{id}` | Обновить **только `stock`** | `200` |
| `DELETE` | `/api/products/{id}` | Удалить товар | `204` |

### Query-параметры `GET /api/products`

| Параметр | Тип | Описание |
|---|---|---|
| `minPrice` | float ≥ 0 | Минимальная цена (включительно) |
| `maxPrice` | float ≥ 0 | Максимальная цена (включительно) |

Если указаны оба — применяется `WHERE price BETWEEN minPrice AND maxPrice`.
Если `minPrice > maxPrice` → `400 Bad Request`.

---

## Примеры запросов

### Создать товар

```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Ноутбук","price":799.99,"stock":10}'
```

Ответ `201 Created`:
```json
{ "id": 1, "name": "Ноутбук", "price": 799.99, "stock": 10 }
```

### Получить все товары

```bash
curl http://127.0.0.1:8000/api/products
```

### Фильтрация по цене

```bash
curl "http://127.0.0.1:8000/api/products?minPrice=100&maxPrice=500"
```

### Только по нижней границе

```bash
curl "http://127.0.0.1:8000/api/products?minPrice=100"
```

### Обновить остаток (только `stock`)

```bash
curl -X PATCH http://127.0.0.1:8000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock":42}'
```

Ответ `200 OK`:
```json
{ "id": 1, "name": "Ноутбук", "price": 799.99, "stock": 42 }
```

> Поля `name` и `price` при PATCH **игнорируются** — схема `ProductStockUpdate` принимает только `stock`.

### Удалить товар

```bash
curl -X DELETE http://127.0.0.1:8000/api/products/1
```

Ответ `204 No Content`.

---

## Валидация и коды ошибок

| Ситуация | Код | Тело ответа |
|---|---|---|
| `price < 0` или `stock < 0` (POST) | `400` | `{"detail": ...}` |
| `stock < 0` (PATCH) | `400` | `{"detail": "stock должен быть >= 0"}` |
| `minPrice > maxPrice` | `400` | `{"detail": "minPrice не может быть больше maxPrice"}` |
| Товар не найден (PATCH / DELETE) | `404` | `{"detail": "Товар не найден"}` |
| Отсутствует обязательное поле | `400` | Pydantic-ошибки |
| Неверный тип данных | `400` | Pydantic-ошибки |

> По умолчанию FastAPI отдаёт `422 Unprocessable Entity` на ошибки Pydantic-валидации. В проекте добавлен глобальный обработчик `RequestValidationError`, который возвращает `400`.
