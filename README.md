# Neforlove

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Telegraf.js-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegraf">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <br>
  <img src="https://img.shields.io/github/package-json/v/Keva1z/neforlove-ts?style=for-the-badge&color=purple" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/github/last-commit/Keva1z/neforlove-ts?style=for-the-badge&color=blue" alt="Last Commit">
</p>

Telegram-бот для знакомств, созданный специально для неформального сообщества. Позволяет находить единомышленников, общаться и знакомиться в комфортной атмосфере.

Изначально проект был разработан на Python с использованием aiogram, но сейчас активно переписывается на TypeScript с фреймворком Telegraf.js.

**Разработчик:** [@Keva1z](https://t.me/Keva1z)

## Возможности

-   **Листание анкет:** Просматривайте анкеты других пользователей.
-   **Система мэтчей:** Отслеживайте взаимные симпатии.
-   **Магазин и кастомизации:** Покупайте уникальные элементы для оформления своей анкеты.
-   **Привилегии:** Расширяйте возможности аккаунта с помощью премиум-подписки.
-   **Реферальная система:** Приглашайте друзей и получайте за это награды.
-   **Интегрированная реклама:** Монетизация для поддержки и развития проекта.

## Статус разработки (TODO)

-   **1. Информация** [ ]
    -   *1.1. Соглашение с правилами и пользовательским соглашением* [x]
    -   *1.2. Просмотр анкет без регистрации* [ ]
-   **2. Регистрация** [x]
-   **3. Создание анкеты** [ ]
-   **4. Меню** [ ]
    -   *4.1. Настройки* [ ]
    -   *4.2. Просмотр анкет* [ ]
    -   *4.3. Мэтчи* [ ]
    -   *4.4. Профиль* [ ]
    -   *4.5. Магазин* [ ]
-   **5. Система рекламы** [ ]
-   **6. Кастомизации** [ ]
-   **7. Реферальная система** [ ]

## Установка и запуск

Перед началом убедитесь, что у вас установлены Node.js и npm.

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/Keva1z/neforlove-ts
    cd neforlove
    ```

2.  **Установите зависимости:**
    ```bash
    npm install
    ```

3.  **Конфигурация:**
    *   Создание .env:
        ```bash
        touch .env
        ```
    *   Внесите туда свои данные, пример находится в .env.example
        Данные для БД можно не менять.

    *   Запуск локальной БД
        ```bash
        docker compose up
        ```
    
    *   Применение миграций к БД ->
        [Drizzle ORM](./docs/drizzle.md)

4.  **Сборка и запуск:**
    *   Для сборки проекта:
        ```bash
        npm run build
        ```
    *   Для запуска бота:
        ```bash
        npm run dev:bot
        ```

## 🤝 Contribute

Мы рады вашим пул-реквестам и идеям! Чтобы внести свой вклад в проект:

1.  Сделайте форк (fork) репозитория.
2.  Создайте новую ветку для вашей функции или исправления:
    ```bash
    git checkout -b feature/amazing-feature
    ```
    или
    ```bash
    git checkout -b fix/horrible-bug
    ```
3.  Внесите свои изменения и сделайте коммит:
    ```bash
    git commit -m 'Add some amazing feature'
    ```
4.  Запушите изменения в вашу ветку на форке:
    ```bash
    git push origin feature/amazing-feature
    ```
5.  Откройте Pull Request в основном репозитории.

Обязательно обсуждайте предлагаемые изменения в issue перед тем, как начать работу над крупными фичами.
