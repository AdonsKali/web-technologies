# 🕐 Часы и часовые пояса

Демонстрационное прогрессивное веб-приложение (PWA) с FastAPI-бэкендом:
отображает текущее время, определяет часовой пояс пользователя через
`Intl.DateTimeFormat()`, поддерживает 12/24-часовой формат и **работает офлайн**
благодаря Service Worker.

---

## 📋 Возможности

- ⏱️ **Живые часы** — обновляются каждую секунду
- 🌍 **Определение часового пояса** через `Intl.DateTimeFormat().resolvedOptions().timeZone`
- 🔄 **Переключение 12/24-часового формата** (12h → AM/PM)
- 📱 **PWA**: устанавливается на устройство
- 📴 **Офлайн-режим**: статика кешируется Service Worker'ом
- 🔌 **REST API** для получения времени

---

## 🗂️ Структура проекта

```
lab6/
├── main.py                
├── requirements.txt      
├── README.md            
└── static/
    ├── index.html         
    ├── about.html         
    ├── styles.css         
    ├── app.js             
    ├── sw.js              
    ├── manifest.json      
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

---

## 🚀 Быстрый старт

### 1. Создать проект

```bash
git clone https://github.com/AdonsKali/web-technologies/tree/932321-derevyankin-yaroslav-lab6
cd lab6
```

### 2. Виртуальное окружение (рекомендуется)

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Установить зависимости

```bash
pip install -r requirements.txt
```

### 4. Сгенерировать иконки (опционально)

```bash
python generate_icons.py
```

### 5. Запустить сервер

```bash
python main.py
```

В консоли появится:

```
Server started on port 8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Откройте: **http://localhost:8000**

---

## ⚙️ Переменные окружения

| Переменная | По умолчанию | Описание          |
|------------|--------------|-------------------|
| `PORT`     | `8000`       | Порт HTTP-сервера |

Пример:

```bash
PORT=9000 python main.py
```

---

## 🌐 Маршруты API

### `GET /`
Главная страница с часами. Возвращает `static/index.html`.

### `GET /about`
Страница «О проекте». Возвращает `static/about.html`.

### `GET /api/time`
Возвращает текущее время.

**Query-параметры:**

| Параметр | Допустимые значения | По умолчанию | Описание                        |
|----------|---------------------|--------------|---------------------------------|
| `format` | `24`, `12`          | `24`         | Формат времени: 24h или 12h (AM/PM) |

**Успешный ответ (200):**

```json
{
  "time": "14:35:27",
  "timezone": "UTC",
  "format": "24h"
}
```

С `?format=12`:

```json
{
  "time": "02:35:27 PM",
  "timezone": "UTC",
  "format": "12h"
}
```

**Ошибка (500):**

```json
{
  "error": "Internal server error"
}
```


### `GET /api/status`

```json
{
  "status": "ok",
  "service": "clock-api"
}
```

### `GET /sw.js`, `GET /manifest.json`
Отдают Service Worker и манифест с корня сайта.

---

## 🧪 Примеры запросов

**cURL:**

```bash
curl http://localhost:8000/api/time
curl "http://localhost:8000/api/time?format=12"
curl http://localhost:8000/api/status
```

**Python:**

```python
import requests

r = requests.get("http://localhost:8000/api/time", params={"format": "12"})
print(r.json())
# {'time': '02:35:27 PM', 'timezone': 'UTC', 'format': '12h'}
```

**JavaScript:**

```javascript
const res = await fetch("/api/time?format=12");
const data = await res.json();
console.log(data.time, data.format);
```

---

## 📱 Установка как PWA

- **Desktop (Chrome/Edge):** иконка «Установить» в адресной строке.
- **Android (Chrome):** меню → «Установить приложение».

