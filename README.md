# Social Club Site

Сайт с календарём событий, синхронизированный с Notion.

## Структура файлов

```
social-club/
├── public/
│   └── index.html      ← Сайт
├── api/
│   └── events.js       ← API: читает данные из Notion
├── vercel.json         ← Настройки Vercel
└── README.md
```

## Деплой на Vercel

### 1. Загрузи на GitHub
- Создай новый репозиторий на github.com
- Загрузи все файлы этой папки

### 2. Подключи к Vercel
- Зайди на vercel.com → New Project
- Выбери свой GitHub репозиторий
- Нажми Deploy (пока упадёт с ошибкой — это нормально)

### 3. Добавь переменные окружения
В Vercel → Settings → Environment Variables добавь:

| Name | Value |
|------|-------|
| NOTION_API_KEY | твой токен (secret_xxx...) |
| NOTION_DATABASE_ID | ID базы данных |

### 4. Redeploy
Vercel → Deployments → нажми три точки → Redeploy

Сайт будет доступен по адресу yourproject.vercel.app

## Поля в Notion (Events база)

Сайт читает следующие поля:
- **Name** — название события
- **Date** — дата (тип Date)
- **City** — город (Select или Text)
- **Image** — картинка (Files & Media)
- **Register** — ссылка на регистрацию (URL)
- **Spots** — количество мест (Number)
