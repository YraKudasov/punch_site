# Кнопка-Груша Силомер - Глобальный рекорд

Игра с глобальным рейтингом, хранящимся в Firebase Realtime Database.

## Как работает глобальный рекорд

### Firebase Configuration

В файле `firebase-config.js` хранятся параметры подключения к базе данных. Для работы вам нужно:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Включите Realtime Database
3. Скопируйте конфигурацию проекта в `firebase-config.js`

### Пример конфигурации Firebase

```javascript
// firebase-config.js
const firebaseConfig = {
    apiKey: "ваш-api-key",
    authDomain: "your-project-name.firebaseapp.com",
    databaseURL: "https://your-project-name-default-rtdb.firebaseio.com",
    projectId: "your-project-name",
    storageBucket: "your-project-name.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789"
};
```

### Настройка безопасности Firebase

В Firebase Console перейдите в Realtime Database → Rules и установите правила:

```json
{
  "rules": {
    "highScore": {
      ".read": true,
      ".write": true
    }
  }
}
```

Это позволит всем пользователям читать и обновлять глобальный рекорд. Для продакшена рекомендуется настроить более строгие правила.

## Функционал

### Основные возможности

- **Глобальный рекорд** - Рейтинг сохраняется в Firebase и доступен всем пользователям
- **Локальный fallback** - Если Firebase недоступен, используется localStorage
- **Адаптивный дизайн** - Работает на мобильных устройствах и планшетах
- **Разные звуки** - Звуковые эффекты для разных уровней силы удара
- **Бонусы и комбо** - Случайные бонусы и множители для комбо ударов

### Начало работы

1. Установите зависимости (не требуется для статического хостинга)
2. Разверните проект на GitHub Pages или другом статическом хостинге
3. Создайте Firebase проект и настройте конфигурацию
4. Опубликуйте обновленный `firebase-config.js`

### Сборка и запуск локально

```bash
# Установите serve для локального запуска
npm install -g serve

# Запустите локальный сервер
serve -p 8080
```

## Структура проекта

```
├── index.html              # Главная страница игры
├── script.js              # Логика игры
├── styles.css             # Стили
├── firebase-config.js     # Конфигурация Firebase
├── README.md              # Документация
```

## Технологии

- HTML5 Canvas и SVG для анимаций
- CSS3 для адаптивного дизайна
- JavaScript для логики игры
- Firebase Realtime Database для глобального рейтинга
- Web Audio API для звуковых эффектов

## Команды

### Проверка линтером

```bash
npx eslint script.js
```

### Сжатие CSS и JavaScript

```bash
npm run build
```

## Безопасность

- Firebase конфигурация публична и не содержит секретных ключей
- Доступ к базе данных ограничен простыми правилами безопасности
- Локальный хостинг через GitHub Pages обеспечивает HTTPS

## Лицензия

MIT