**Русский** · [English](./README.en.md)

# Дуа — сборник дуа и азкаров из Сунны

Цифровой сборник дуа и азкаров, подтверждённых достоверными хадисами Пророка ﷺ. 134 главы с аудио, пословным арабско-русско-английским переводом, пояснениями и источниками по каждой мольбе.

**Сайт:** [dua.shakhbanov.org](https://dua.shakhbanov.org)

## Возможности

- **134 главы, ~280 дуа** — арабский текст с огласовками, пословный перевод, аудио
- **Аудио** — запись каждой дуа (хостится на S3), с плеером, регулировкой скорости и громкости
- **Пословный перевод** — синхронизированный с аудио по таймкодам арабский текст с подсветкой активного слова
- **Два языка интерфейса** — русский и английский; автоопределение по `navigator.language`, часовому поясу и выбору пользователя
- **Источники** — каждая дуа снабжена ссылкой на сборник хадисов (аль-Бухари, Муслим, ан-Наса’и, Абу Дауд, ат-Тирмизи, Ибн Маджа, Ахмад и др.) на обоих языках
- **Время намазов** — расчёт по геолокации через библиотеку `adhan` с выбором метода (ДУМ РФ, MWL, Карачи, Египетский, Умм аль-Кура, Турция, ISNA и др.) и мазхаба (Шафии/Ханафи)
- **Локальные уведомления** — напоминания о намазах и времени утренних/вечерних азкаров
- **PWA** — устанавливается как приложение на Android и iOS (16.4+), работает офлайн
- **Тёмная тема** — автоматическая по системе, переключатель в шапке
- **Адаптивный интерфейс** — оптимизирован для мобильного, планшета и десктопа

## Стек

| Область | Технология |
|---------|-----------|
| Frontend | React 19, TypeScript, Vite 6 |
| Стили | Tailwind CSS (CDN), CSS custom properties для тем |
| Иконки | lucide-react |
| Время намазов | adhan-js |
| PWA | vite-plugin-pwa + Workbox (injectManifest) |
| Аналитика | Яндекс.Метрика (ID в `.env.local`) |
| Хостинг | GitHub Pages (ветка `gh-pages`) |
| Домен | `dua.shakhbanov.org` (CNAME) |
| Аудио CDN | s3.shakhbanov.org |

React, lucide-react и adhan подгружаются в браузер через native importmap с `esm.sh`, поэтому бандл остаётся лёгким.

## Структура проекта

```
dua-from-sunna/
├── data/
│   └── chapters/                  # 134 .ts-файла, по одному на главу
│       └── NNN-slug.ts            # ChapterData с массивом duas
├── components/
│   ├── Player.tsx                 # Аудио-плеер с seek/speed/volume
│   ├── WordGrid.tsx               # Пословная сетка с подсветкой
│   └── PrayerTimesPanel.tsx       # Панель «Время намазов» с настройками
├── src/
│   ├── i18n/
│   │   ├── detectLanguage.ts      # Определение языка пользователя
│   │   └── strings.ts             # UI-строки ru/en
│   ├── features/
│   │   ├── prayer/                # adhan обёртка + настройки
│   │   ├── geolocation/           # Geolocation API + IP fallback
│   │   └── notifications/         # Планирование локальных push
│   ├── analytics/
│   │   └── yandexMetrika.ts       # Трекер SPA-переходов
│   ├── seo/
│   │   └── updateMetaTags.ts      # Динамические OG/hreflang/JSON-LD
│   └── sw/
│       └── service-worker.ts      # Workbox: offline кэш, планировщик уведомлений
├── public/
│   ├── icons/                     # Android/iOS PWA иконки
│   ├── splashes/                  # 14 Apple splash screens
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml                # Генерируется на build
├── scripts/
│   ├── generate-sitemap.mjs       # 272 URL × hreflang
│   ├── generate-splashes.sh       # SVG → PNG для iOS splash
│   ├── translate-sources.mjs      # RU → EN транслитерация источников
│   └── fix-source-en.mjs
├── App.tsx
├── index.html
├── constants.ts                   # MOCK_DATABASE — импорт всех глав
├── types.ts                       # ChapterData / DuaItem / WordSync / Language
└── vite.config.ts
```

## Модель данных

Каждая дуа в `data/chapters/NNN-slug.ts` — это объект `DuaItem`:

```ts
interface DuaItem {
  id: string;                      // "3-1", "29-17a", ...
  audioUrl: string;
  narration?: { ru: string; en: string };          // Контекст хадиса перед дуа
  fullTranslation: { ru: string; en: string };     // Литературный перевод
  note?: { ru: string; en: string };               // Примечание после дуа
  source?: { ru: string; en: string };             // Хадис-референс
  sync: WordSync[];                                // Пословный разбор + таймкоды
}

interface WordSync {
  text: string;                    // Арабское слово
  trans: { ru: string; en: string };
  start: number;                   // Секунды от начала аудио
  end: number;
}
```

Главы индексируются в `constants.ts` и экспортируются как `MOCK_DATABASE`.

## Запуск локально

Требования: Node.js 20+.

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5050`.

## Сборка и деплой

### Автодеплой через GitHub Actions

На каждый push в `main` workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Устанавливает зависимости
2. Собирает приложение через `npm run build`
3. Публикует `dist/` в ветку `gh-pages`

GitHub Pages раздаёт ветку `gh-pages` на `dua.shakhbanov.org` (CNAME настроен в DNS).

### Ручной деплой через worktree

```bash
npm run build

git worktree add -B gh-pages /tmp/gh-pages-deploy origin/gh-pages
rm -rf /tmp/gh-pages-deploy/*
cp -r dist/* /tmp/gh-pages-deploy/
echo "dua.shakhbanov.org" > /tmp/gh-pages-deploy/CNAME
cp /tmp/gh-pages-deploy/index.html /tmp/gh-pages-deploy/404.html

cd /tmp/gh-pages-deploy
git add -A
git commit -m "Deploy"
git push origin gh-pages
cd -
git worktree remove /tmp/gh-pages-deploy --force
```

`404.html = index.html` нужен, чтобы gh-pages корректно отдавал SPA по query-параметрам (`?chapter=N&lang=ru`).

## Команды NPM

| Команда | Что делает |
|---------|-----------|
| `npm run dev` | Dev-сервер на порту 5050 с HMR |
| `npm run build` | Production-сборка в `dist/` + генерация sitemap |
| `npm run preview` | Локальный preview собранной версии |
| `npm run sitemap` | Перегенерировать `sitemap.xml` отдельно |

## Работа с главами

Каждая глава — отдельный TypeScript-файл. Пример минимальной структуры:

```ts
// data/chapters/003-supplications-upon-waking-up.ts
import { ChapterData } from '../../types';

export const CHAPTER_003: ChapterData = {
  id: 3,
  title: { ru: "Слова поминания при пробуждении", en: "Supplications upon waking up" },
  duas: [
    {
      id: "3-1",
      audioUrl: "https://s3.shakhbanov.org/dua-from-sunna/1.wav",
      fullTranslation: {
        ru: "Хвала Аллаху, Который оживил нас…",
        en: "All praise is for Allah who gave us life…"
      },
      sync: [
        { text: "الْحَمْدُ", trans: { ru: "Хвала", en: "Praise" }, start: 0.240, end: 1.101 },
        // ...
      ],
      source: { ru: "аль-Бухари 6312; Муслим 2711", en: "al-Bukhari 6312; Muslim 2711" }
    }
  ]
};
```

### Добавление новой главы

1. Создать файл `data/chapters/NNN-slug.ts`
2. Добавить импорт и запись в массив в `constants.ts`:
   ```ts
   import { CHAPTER_NNN } from './data/chapters/NNN-slug';
   // …
   export const MOCK_DATABASE = [/* …, */ CHAPTER_NNN];
   ```
3. Новая глава автоматически попадёт в sitemap при следующем билде

### Источники (bilingual)

Поле `source` всегда `{ ru: string; en: string }`. Утилита [`scripts/translate-sources.mjs`](scripts/translate-sources.mjs) умеет транслитерировать русские цитаты в английские (аль-Бухари → al-Bukhari, ат-Тирмизи → at-Tirmidhi и т. д.) — использовать при миграции старых данных.

## Маршрутизация

Приложение — SPA, но состояние синхронизируется с URL через query-параметры:

| Параметр | Значения | Пример |
|----------|---------|--------|
| `chapter` | 1–136 | `?chapter=29` |
| `lang` | `ru`, `en` | `?lang=en` |
| `view` | `chapter`, `prayer-times` | `?view=prayer-times` |
| `q` | строка | `?q=утренние` |

`history.replaceState` используется для обновления URL без перезагрузки. `popstate` обрабатывает кнопки Назад/Вперёд.

## PWA

Service Worker реализует:

- **Precache** всех статических ассетов при первом визите
- **NetworkFirst** для HTML (обновления долетают быстро)
- **CacheFirst** для S3-аудио (30 дней, 300 записей, поддержка Range-запросов)
- **StaleWhileRevalidate** для Google Fonts, Tailwind CDN, esm.sh, Яндекс.Метрики
- **Планировщик локальных уведомлений** через `postMessage` → `setTimeout`

### Ограничения на iOS

Web Push на iOS (16.4+) работает только после добавления PWA на домашний экран через Safari → «Поделиться → На экран Домой». До этого момента кнопка запроса разрешений возвращает `denied`. Панель намазов содержит подсказку для пользователей iOS.

Фоновые push-уведомления (когда PWA закрыта) требуют серверный backend с VAPID — сейчас не реализовано. Есть только локальные уведомления, срабатывающие пока приложение открыто или недавно было в фоне.

## SEO

- **Динамические meta-теги** — `<title>`, description, canonical, Open Graph, Twitter Cards обновляются на каждую смену главы/языка/view через [`updateMetaTags.ts`](src/seo/updateMetaTags.ts)
- **hreflang** — альтернативы `ru` / `en` / `x-default` для каждой страницы
- **Schema.org JSON-LD** — `WebSite`, `Book` (общие), `Article` + `BreadcrumbList` (на уровне главы)
- **Sitemap** — [`sitemap.xml`](https://dua.shakhbanov.org/sitemap.xml): 272 URL с `xhtml:link hreflang`
- **robots.txt** — ссылка на sitemap
- Верификация для Яндекс.Вебмастера и Google Search Console (файлы генерируются при билде из `.env.local`)

## Аналитика

Яндекс.Метрика с вебвизором, картой кликов, трекингом ссылок и точной оценкой отказов. ID счётчика хранится в `.env.local` (`VITE_YANDEX_METRIKA_ID`) и подставляется в `index.html` при сборке. SPA-переходы между главами отправляют `ym('hit', url, {title})` вручную.

## Секреты и переменные окружения

Никакие идентификаторы (счётчики, верификационные коды) не хранятся в репозитории. Скопируйте [`.env.local.example`](.env.local.example) в `.env.local` и заполните своими значениями:

```bash
cp .env.local.example .env.local
# отредактируйте .env.local
```

| Переменная | Назначение |
|------------|-----------|
| `VITE_YANDEX_METRIKA_ID` | ID счётчика Яндекс.Метрики |
| `VITE_YANDEX_WEBMASTER_CODE` | Код из имени файла `yandex_<CODE>.html` |
| `VITE_GOOGLE_VERIFICATION_CODE` | Код из имени файла `google<CODE>.html` |

При сборке [`scripts/generate-verification.mjs`](scripts/generate-verification.mjs) создаёт файлы верификации прямо в `dist/` — они попадают в `gh-pages`, но не в исходный код.

## Лицензия

Арабские тексты дуа — общественное достояние (цитируются из достоверных сборников хадисов). Код приложения — MIT.
