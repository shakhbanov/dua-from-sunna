import type { Language } from '../../types';

export type UIStrings = {
  search: string;
  searchPlaceholder: string;
  nothingFound: string;
  nextDua: string;
  previousDua: string;
  nextChapter: string;
  previousChapter: string;
  chapter: string;
  comingSoon: string;
  prayerTimes: string;
  prayerTimesTitle: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  location: string;
  locationAsk: string;
  locationDenied: string;
  detectingLocation: string;
  notifications: string;
  notificationsEnable: string;
  notificationsEnabled: string;
  notificationsDenied: string;
  notificationsUnsupported: string;
  notificationsIOSHint: string;
  morningAdhkarTitle: string;
  morningAdhkarBody: string;
  eveningAdhkarTitle: string;
  eveningAdhkarBody: string;
  fajrReminderTitle: string;
  fajrReminderBody: string;
  maghribReminderTitle: string;
  maghribReminderBody: string;
  installPWA: string;
  installPromptTitle: string;
  installPromptBodyAndroid: string;
  installPromptBodyIOS: string;
  installPromptCta: string;
  installPromptLater: string;
  installIOSStep1: string;
  installIOSStep2: string;
  settings: string;
  language: string;
  wordByWord: string;
  highlightWords: string;
  close: string;
  calculationMethod: string;
  madhab: string;
  methodRussia: string;
  methodMWL: string;
  methodKarachi: string;
  methodEgyptian: string;
  methodUmmAlQura: string;
  methodTurkey: string;
  methodNorthAmerica: string;
  methodMoonsighting: string;
  methodDubai: string;
  methodQatar: string;
  methodKuwait: string;
  methodSingapore: string;
  methodTehran: string;
  madhabShafi: string;
  madhabHanafi: string;
  // Source (collection) switcher
  source: string;
  sourceSunna: string;
  sourceQuran: string;
  foundInOtherSource: string;
  openSourceQuran: string;
  openSourceSunna: string;
  chapters: string;
  duasCount: string;
  readInQuran: string;
  home: string;
  menu: string;
  toggleTheme: string;
  closeMenu: string;
  goToDua: string;
  play: string;
  pause: string;
  rewindSeconds: string;
  forwardSeconds: string;
  mute: string;
  unmute: string;
  volume: string;
  seek: string;
  playbackSpeed: string;
  refresh: string;
};

export const I18N: Record<Language, UIStrings> = {
  ru: {
    search: 'Поиск',
    searchPlaceholder: 'Поиск по главам...',
    nothingFound: 'Ничего не найдено',
    nextDua: 'Следующая дуа',
    previousDua: 'Предыдущая дуа',
    nextChapter: 'Следующая глава',
    previousChapter: 'Предыдущая глава',
    chapter: 'Глава',
    comingSoon: 'Контент для этой главы скоро будет добавлен.',
    prayerTimes: 'Время намазов',
    prayerTimesTitle: 'Время намазов',
    fajr: 'Фаджр',
    sunrise: 'Восход',
    dhuhr: 'Зухр',
    asr: 'Аср',
    maghrib: 'Магриб',
    isha: 'Иша',
    location: 'Местоположение',
    locationAsk: 'Разрешить геолокацию для расчёта времени намазов',
    locationDenied: 'Доступ к геолокации запрещён. Координаты определены по IP.',
    detectingLocation: 'Определяем местоположение...',
    notifications: 'Уведомления',
    notificationsEnable: 'Включить напоминания',
    notificationsEnabled: 'Уведомления включены',
    notificationsDenied: 'Уведомления запрещены в настройках браузера',
    notificationsUnsupported: 'Ваш браузер не поддерживает уведомления',
    notificationsIOSHint: 'На iOS сначала добавьте приложение на домашний экран через «Поделиться → На экран «Домой»».',
    morningAdhkarTitle: 'Утренние азкары',
    morningAdhkarBody: 'Время утренних поминаний Аллаха',
    eveningAdhkarTitle: 'Вечерние азкары',
    eveningAdhkarBody: 'Время вечерних поминаний Аллаха',
    fajrReminderTitle: 'Намаз Фаджр',
    fajrReminderBody: 'Наступило время утреннего намаза',
    maghribReminderTitle: 'Намаз Магриб',
    maghribReminderBody: 'Наступило время закатного намаза',
    installPWA: 'Установить приложение',
    installPromptTitle: 'Установить «Дуа» на домашний экран',
    installPromptBodyAndroid: 'Быстрый доступ, офлайн-режим и уведомления о намазах.',
    installPromptBodyIOS: 'Читайте дуа и азкары офлайн, получайте напоминания о намазах.',
    installPromptCta: 'Установить',
    installPromptLater: 'Позже',
    installIOSStep1: 'Нажмите «Поделиться»',
    installIOSStep2: 'Выберите «На экран «Домой»»',
    settings: 'Настройки',
    language: 'Язык',
    wordByWord: 'Пословный перевод',
    highlightWords: 'Выделение слов',
    close: 'Закрыть',
    calculationMethod: 'Метод расчёта',
    madhab: 'Мазхаб (для Аср)',
    methodRussia: 'ДУМ РФ (16°/15°)',
    methodMWL: 'Всемирная лига (18°/17°)',
    methodKarachi: 'Карачи (18°/18°)',
    methodEgyptian: 'Египетский (19.5°/17.5°)',
    methodUmmAlQura: 'Умм аль-Кура (Мекка)',
    methodTurkey: 'Турция',
    methodNorthAmerica: 'Северная Америка (ISNA)',
    methodMoonsighting: 'Комитет наблюдения за луной',
    methodDubai: 'ОАЭ',
    methodQatar: 'Катар',
    methodKuwait: 'Кувейт',
    methodSingapore: 'Сингапур',
    methodTehran: 'Тегеран',
    madhabShafi: 'Шафии (ранний Аср)',
    madhabHanafi: 'Ханафи (поздний Аср)',
    source: 'Источник',
    sourceSunna: 'Из Сунны',
    sourceQuran: 'Из Корана',
    foundInOtherSource: 'Найдено в другом источнике',
    openSourceQuran: 'Перейти к дуа из Корана',
    openSourceSunna: 'Перейти к дуа из Сунны',
    chapters: 'глав',
    duasCount: 'дуа',
    readInQuran: 'Открыть аят',
    home: 'Главная',
    menu: 'Меню',
    toggleTheme: 'Сменить тему',
    closeMenu: 'Закрыть меню',
    goToDua: 'Перейти к дуа',
    play: 'Воспроизвести',
    pause: 'Пауза',
    rewindSeconds: 'Назад на 5 секунд',
    forwardSeconds: 'Вперёд на 10 секунд',
    mute: 'Выключить звук',
    unmute: 'Включить звук',
    volume: 'Громкость',
    seek: 'Перемотка',
    playbackSpeed: 'Скорость воспроизведения',
    refresh: 'Обновить',
  },
  en: {
    search: 'Search',
    searchPlaceholder: 'Search chapters...',
    nothingFound: 'Nothing found',
    nextDua: 'Next dua',
    previousDua: 'Previous dua',
    nextChapter: 'Next chapter',
    previousChapter: 'Previous chapter',
    chapter: 'Chapter',
    comingSoon: 'Content for this chapter will be added soon.',
    prayerTimes: 'Prayer times',
    prayerTimesTitle: 'Prayer times',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    location: 'Location',
    locationAsk: 'Allow geolocation to calculate prayer times',
    locationDenied: 'Location access denied. Coordinates resolved via IP.',
    detectingLocation: 'Detecting location...',
    notifications: 'Notifications',
    notificationsEnable: 'Enable reminders',
    notificationsEnabled: 'Notifications enabled',
    notificationsDenied: 'Notifications are blocked in browser settings',
    notificationsUnsupported: 'Your browser does not support notifications',
    notificationsIOSHint: 'On iOS, add this app to the home screen first via Share → Add to Home Screen.',
    morningAdhkarTitle: 'Morning adhkar',
    morningAdhkarBody: 'Time for morning remembrances of Allah',
    eveningAdhkarTitle: 'Evening adhkar',
    eveningAdhkarBody: 'Time for evening remembrances of Allah',
    fajrReminderTitle: 'Fajr prayer',
    fajrReminderBody: 'Time for the morning prayer',
    maghribReminderTitle: 'Maghrib prayer',
    maghribReminderBody: 'Time for the sunset prayer',
    installPWA: 'Install app',
    installPromptTitle: 'Install “Dua” to your home screen',
    installPromptBodyAndroid: 'Fast access, offline reading, and prayer-time reminders.',
    installPromptBodyIOS: 'Read duas and adhkars offline, get prayer-time reminders.',
    installPromptCta: 'Install',
    installPromptLater: 'Later',
    installIOSStep1: 'Tap the Share icon',
    installIOSStep2: 'Choose “Add to Home Screen”',
    settings: 'Settings',
    language: 'Language',
    wordByWord: 'Word-by-word translation',
    highlightWords: 'Highlight words',
    close: 'Close',
    calculationMethod: 'Calculation method',
    madhab: 'Madhab (for Asr)',
    methodRussia: 'Russia / DUM RF (16°/15°)',
    methodMWL: 'Muslim World League (18°/17°)',
    methodKarachi: 'Karachi (18°/18°)',
    methodEgyptian: 'Egyptian (19.5°/17.5°)',
    methodUmmAlQura: 'Umm al-Qura (Makkah)',
    methodTurkey: 'Turkey',
    methodNorthAmerica: 'North America (ISNA)',
    methodMoonsighting: 'Moonsighting Committee',
    methodDubai: 'Dubai (UAE)',
    methodQatar: 'Qatar',
    methodKuwait: 'Kuwait',
    methodSingapore: 'Singapore',
    methodTehran: 'Tehran',
    madhabShafi: 'Shafi (earlier Asr)',
    madhabHanafi: 'Hanafi (later Asr)',
    source: 'Source',
    sourceSunna: 'Sunnah',
    sourceQuran: 'Quran',
    foundInOtherSource: 'Found in the other source',
    openSourceQuran: 'Go to duas from the Quran',
    openSourceSunna: 'Go to duas from the Sunnah',
    chapters: 'chapters',
    duasCount: 'duas',
    readInQuran: 'Open the ayah',
    home: 'Home',
    menu: 'Menu',
    toggleTheme: 'Toggle theme',
    closeMenu: 'Close menu',
    goToDua: 'Go to dua',
    play: 'Play',
    pause: 'Pause',
    rewindSeconds: 'Back 5 seconds',
    forwardSeconds: 'Forward 10 seconds',
    mute: 'Mute',
    unmute: 'Unmute',
    volume: 'Volume',
    seek: 'Seek',
    playbackSpeed: 'Playback speed',
    refresh: 'Refresh',
  },
};

export function t(lang: Language, key: keyof UIStrings): string {
  return I18N[lang][key];
}
