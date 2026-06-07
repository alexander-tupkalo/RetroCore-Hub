/**
 * RETROCORE://UNKNOWN_SECTOR
 * Localization System
 * Shared across hub and all module pages
 */

const STORAGE_KEY = 'retrocore-lang';

const translations = {

  en: {
    'header.protocol':       'RETROCORE://UNKNOWN_SECTOR',
    'header.subtitle':       'RESTRICTED NETWORK ACCESS',
    'header.access':         'ACCESS GRANTED',
    'header.clearance':      'CLEARANCE LEVEL: ANOMALY',
    'hero.p1':               'This network branch exists outside standard RETROCORE infrastructure.',
    'hero.p2':               'Signal origin remains unresolved.',
    'hero.p3':               'Anomalous activity has been recorded across multiple observation nodes.',
    'labels.purpose':        'Purpose:',
    'modules.night.status':  'ACTIVE',
    'modules.night.title':   'NIGHT OBSERVER',
    'modules.night.desc':    'Remote anomaly monitoring subsystem.',
    'modules.night.purpose': 'Observe unidentified aerial events, signal disturbances and surveillance anomalies.',
    'modules.night.btn':     'ENTER MODULE',
    'modules.signal.status': 'UNVERIFIED',
    'modules.signal.title':  'OUTSIDE SIGNAL',
    'modules.signal.desc':   'Recovered transmission of unknown origin.',
    'modules.signal.purpose':'Analyze transmissions, frequencies and non-standard signal structures.',
    'modules.signal.btn':    'ENTER MODULE',
    'panel.title':           'SYSTEM TERMINAL',
    'panel.nodeStatus':      'NODE STATUS:',
    'panel.nodeOnline':      'ONLINE',
    'panel.obsNodes':        'OBSERVATION NODES:',
    'panel.obsActive':       '07 ACTIVE',
    'panel.anomalies':       'ANOMALIES:',
    'panel.anomaliesCount':  '03 DETECTED',
    'panel.signalOrigin':    'SIGNAL ORIGIN:',
    'panel.signalUnknown':   'UNKNOWN',
    'footer.return':         'RETURN TO MAIN HUB',
    'lang.en':               'EN',
    'lang.ua':               'UA',
    'night.protocol':        'RETROCORE://UNKNOWN_SECTOR/NIGHT_OBSERVER',
    'night.status':          'MODULE LOCKED',
    'night.msg1':            'Observation subsystem initialization pending.',
    'night.msg2':            'Awaiting clearance verification.',
    'night.back':            'RETURN TO UNKNOWN_SECTOR',
    'signal.protocol':       'RETROCORE://UNKNOWN_SECTOR/OUTSIDE_SIGNAL',
    'signal.status':         'SIGNAL LOCKED',
    'signal.msg1':           'Transmission data requires verification.',
    'signal.msg2':           'Frequency analysis subsystem not yet initialized.',
    'signal.origin':         'Origin: unresolved',
    'signal.back':           'RETURN TO UNKNOWN_SECTOR',
    'blacksite.status':      'CLASSIFIED',
    'blacksite.title':       'BLACKSITE',
    'blacksite.desc':        'Access level insufficient.',
    'blacksite.btn':         'ENTER MODULE',
  },

  ua: {
    'header.protocol':       'RETROCORE://UNKNOWN_SECTOR',
    'header.subtitle':       'ОБМЕЖЕНИЙ ДОСТУП ДО МЕРЕЖІ',
    'header.access':         'ДОСТУП НАДАНО',
    'header.clearance':      'РІВЕНЬ ДОПУСКУ: АНОМАЛІЯ',
    'hero.p1':               'Ця гілка мережі існує поза стандартною інфраструктурою RETROCORE.',
    'hero.p2':               'Походження сигналу не встановлено.',
    'hero.p3':               'Аномальну активність зафіксовано на кількох вузлах спостереження.',
    'labels.purpose':        'Призначення:',
    'modules.night.status':  'АКТИВНИЙ',
    'modules.night.title':   'НІЧНИЙ СПОСТЕРІГАЧ',
    'modules.night.desc':    'Підсистема дистанційного моніторингу аномалій.',
    'modules.night.purpose': 'Спостереження за невизнаними повітряними подіями, порушеннями сигналу та аномаліями спостереження.',
    'modules.night.btn':     'УВІЙТИ В МОДУЛЬ',
    'modules.signal.status': 'НЕПЕРЕВІРЕНО',
    'modules.signal.title':  'ЗОВНІШНИЙ СИГНАЛ',
    'modules.signal.desc':   'Відновлена передача невідомого походження.',
    'modules.signal.purpose':'Аналіз передач, частот та нестандартних структур сигналу.',
    'modules.signal.btn':    'УВІЙТИ В МОДУЛЬ',
    'panel.title':           'СИСТЕМНИЙ ТЕРМІНАЛ',
    'panel.nodeStatus':      'СТАТУС ВУЗЛА:',
    'panel.nodeOnline':      'ОНЛАЙН',
    'panel.obsNodes':        'ВУЗЛИ СПОСТЕРЕЖЕННЯ:',
    'panel.obsActive':       '07 АКТИВНИХ',
    'panel.anomalies':       'АНОМАЛІЇ:',
    'panel.anomaliesCount':  '03 ВИЯВЛЕНО',
    'panel.signalOrigin':    'ПОХОДЖЕННЯ СИГНАЛУ:',
    'panel.signalUnknown':   'НЕВІДОМЕ',
    'footer.return':         'ПОВЕРНУТИСЯ ДО ГОЛОВНОГО ВУЗЛА',
    'lang.en':               'EN',
    'lang.ua':               'UA',
    'night.protocol':        'RETROCORE://UNKNOWN_SECTOR/NIGHT_OBSERVER',
    'night.status':          'МОДУЛЬ ЗАБЛОКОВАНО',
    'night.msg1':            'Ініціалізація підсистеми спостереження очікується.',
    'night.msg2':            'Очікування перевірки допуску.',
    'night.back':            'ПОВЕРНУТИСЯ ДО UNKNOWN_SECTOR',
    'signal.protocol':       'RETROCORE://UNKNOWN_SECTOR/OUTSIDE_SIGNAL',
    'signal.status':         'СИГНАЛ ЗАБЛОКОВАНО',
    'signal.msg1':           'Дані передачі потребують перевірки.',
    'signal.msg2':           'Підсистема частотного аналізу ще не ініціалізована.',
    'signal.origin':         'Походження: не встановлено',
    'signal.back':           'ПОВЕРНУТИСЯ ДО UNKNOWN_SECTOR',
    'blacksite.status':      'ЗАСЕКРЕЧЕНО',
    'blacksite.title':       'BLACKSITE',
    'blacksite.desc':        'Недостатній рівень доступу.',
    'blacksite.btn':         'УВІЙТИ В МОДУЛЬ',
  }

};

let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key] !== undefined) {
      el.textContent = translations[currentLang][key];
    }
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('lang-btn--active');
    } else {
      btn.classList.remove('lang-btn--active');
    }
  });
  document.documentElement.lang = currentLang === 'ua' ? 'uk' : 'en';
}

export function switchLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
  }
}

export function getCurrentLang() {
  return currentLang;
}

export function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

export function extendTranslations(newTranslations) {
  for (const lang of Object.keys(newTranslations)) {
    if (!translations[lang]) translations[lang] = {};
    Object.assign(translations[lang], newTranslations[lang]);
  }
}

export function initI18n() {
  applyTranslations();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLang(btn.dataset.lang);
    });
  });
}