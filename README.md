**Русский** · [English](./README.en.md)

# Дуа — сборник дуа и азкаров из Сунны и Корана

Цифровой сборник дуа и азкаров, подтверждённых достоверными хадисами Пророка ﷺ, и мольб, приведённых в Коране. 144 главы с пословным арабско-русско-английским переводом, пояснениями и источниками по каждой мольбе.

**Сайт:** [dua.shakhbanov.org](https://dua.shakhbanov.org)

## Возможности

- **Два источника** — 134 главы из Сунны (~280 дуа, с аудио) и 10 тематических глав дуа из Корана (35 мольб с указанием суры и аята); переключатель источника в сайдбаре, каждый источник — отдельный раздел URL
- **144 главы** — арабский текст с огласовками, пословный перевод, аудио (для дуа из Сунны)
- **Аудио** — запись каждой дуа (хостится на S3), с плеером, регулировкой скорости и громкости
- **Пословный перевод** — синхронизированный с аудио по таймкодам арабский текст с подсветкой активного слова
- **Два языка интерфейса** — русский и английский; автоопределение по `navigator.language`, часовому поясу и выбору пользователя
- **Источники** — каждая дуа снабжена ссылкой на сборник хадисов (аль-Бухари, Муслим, ан-Наса’и, Абу Дауд, ат-Тирмизи, Ибн Маджа, Ахмад и др.) на обоих языках; коранические дуа — ссылкой на суру и аят со ссылкой на quran.com
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
│   ├── chapters/                  # 134 .ts-файла Сунны, по одному на главу
│   │   └── NNN-slug.ts            # ChapterData с массивом duas
│   ├── quran/                     # 10 .ts-файлов дуа из Корана (id 2001+)
│   │   ├── NNNN-slug.ts           # ChapterData с collection: 'quran'
│   │   └── index.ts               # QURAN_DATABASE
│   ├── collections.ts             # Реестр коллекций: префиксы URL, слаги, доступ
│   ├── slugs.ts                   # Слаги глав Сунны
│   └── quranSlugs.ts              # Слаги глав Корана
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
│   ├── generate-sitemap.mjs       # 320 URL × hreflang (из routeCatalog())
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

### Ручной деплой (когда Actions недоступны)

```bash
./scripts/deploy-gh-pages.sh            # сборка + публикация в gh-pages
./scripts/deploy-gh-pages.sh --no-build # опубликовать уже собранный dist/
```

Скрипт повторяет то, что делает CI: собирает `dist/`, прогоняет те же
sanity-проверки пререндера, выкладывает содержимое в ветку `gh-pages` одним
коммитом (`--force`, как `force_orphan` у peaceiris), проставляет `CNAME` и
`.nojekyll`. Требуется доступ на запись в `origin` — проверить можно так:

```bash
git ls-remote origin >/dev/null && echo ok
```

`404.html` приходит из `public/404.html` — это SPA-шим, который сохраняет
исходный путь в `sessionStorage` перед редиректом. Перезаписывать его копией
`index.html` не нужно.

После деплоя URL можно анонсировать вручную:

```bash
npm run indexnow:changed -- HEAD~1
```

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
