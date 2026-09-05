# Система бронирования переговорных комнат (Meeting Room Booking App)

---

## Выбранный стек технологий

### Core
* **React** — библиотека для построения компонентного пользовательского интерфейса.
* **TypeScript** — строгая типизация для повышения надёжности кода и автодополнения в IDE.
* **Vite** — молниеносный инструмент сборки и Dev Server с поддержкой Hot Module Replacement (HMR).

### State Management & Data Fetching
* **TanStack Query (React Query)** — кеширование, асинхронное получение данных с сервера, управление состояниями загрузки (`isLoading`) и ошибок (`isError`), а также авто-рефечинг.
* **React Router DOM** — клиентский роутинг (переходы между списком комнат, деталями комнаты и страницей 404).
* **WebSocket (ws)** - получение обновлений в real-time.

### UI & UX
* **React Icons** — иконки.
* **CSS** — cтилизация.

### Testing & QA
* **Vitest** — быстрый фреймворк для юнит- и интеграционного тестирования.
* **Testing Library (React)** — тестирование компонентов через паттерны, близкие к реальному взаимодействию пользователя с DOM (`screen`, `fireEvent`, `getByTestId`).
* **JSDOM** — эмуляция DOM-окружения для запуска тестов в Node.js.

---

## Быстрый запуск

### Предварительные требования
Убедитесь, что у вас установлены:
* **Node.js** (версии `18.x` или выше)
* **npm** / **pnpm** / **yarn**

### 1. Клонирование репозитория и установка зависимостей
```bash
# Клонируйте репозиторий
git clone https://github.com/talense-tasks/frontend-trainee-assignment-autumn-2026-flow-2-edgardinh0-5535b380/tree/main

# Перейдите в папку проекта
cd frontend-trainee-assignment-autumn-2026-flow-2-edgardinh0-5535b380/client

# Установите зависимости
npm install
```

### 2. Запуск
```bash 

npm run dev
```

### 3. Юнит-тесты
```bash
# Перейдите в папку tests
cd client/src/tests
# Запуск одного из тестов
npx vitest {Имя файла}
# Запуск всех тестов сразу
npx vitest run
```

### 4. Структура проекта
```bash
src/
├── api/                  # Настройка API-клиента и асинхронных запросов
├── components/           # UI-компоненты (RoomCard, RoomSchedule, ErrorState, и др.)
├── hooks/                # Кастомные React-хуки (useRooms, useRoomDetails, useRoomBookings)
├── pages/                # Страницы приложения (RoomsPage, RoomDetailsPage, NotFoundPage)
│   ├── RoomsPage.tsx
│   ├── BookingsPage.tsx
│   ├── RoomDetailsPage.tsx
│   ├── NotFoundPage.tsx
├── routes/               # Файл с react-router
├── tests/                # Тесты страниц
│   ├── RoomsPage.test.tsx
│   ├── BookingsPage.test.tsx
│   ├── RoomDetailsPage.test.tsx
│   ├── NotFoundPage.test.tsx
├── types/                # Кастомные типы
├── styles/               # CSS-стили страниц и компонентов
├── App.tsx               # Корневой компонент с настроенным Router и QueryClient
└── main.tsx              # Точка входа в приложение
