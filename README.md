# Лившиц Леонид Игоревич

# https://t.me/Leo_Livshitz

```bash
git clone https://github.com/leonidlivshits/NIS_REACT_LIVSHITS
cd NIS_REACT_LIVSHITS

npm install

# запуск
npm run dev 

 # мок‑бэкенд
npm run server

# сборка
npm run build
```


## Тестирование

```bash
npm run test
npm run test:coverage
```

## Линтинг

```bash
npm run lint #ESLint
```

## Pre‑commit и CI

- При коммите через Husky + lint‑staged запускаются линтеры и форматирование (по идее, должны)
- GitHub Actions проверяет код при каждом push / pull request

## Вход в приложение

**Тестовые данные DummyJSON:**  
логин: `kminchelle`  
пароль: `0lelplR`

## Структура (FSD)

- `app/` - store, роутинг
- `pages/` - страницы
- `widgets/` - Header, Sidebar, ProtectedLayout
- `features/` - auth, products, settings
- `entities/` - Product, User
- `shared/` - i18n, утилиты