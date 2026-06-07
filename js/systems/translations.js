/**
 * RETROCORE://HUB — translations.js
 * Complete bilingual string table — EN + UA.
 * Keys map directly to data-i18n attributes in DOM and t() calls in JS.
 * Add 'ru' key to extend — engine handles it automatically.
 */

export const translations = {

  /* ══════════════════════════════════════════════════
     ENGLISH
  ══════════════════════════════════════════════════ */
  en: {
    /* ── Meta ────────────────────────────────────── */
    pageTitle:             'RETROCORE://HUB',
    pageDesc:              'Vintage signals from a forgotten digital future.',

    /* ── Header ─────────────────────────────────── */
    navRegister:           'REGISTER',
    navAriaHome:           'RETROCORE HUB — Home',
    navAriaLang:           'Language selection',

    /* ── Hero ────────────────────────────────────── */
    heroEyebrow:           'SIGNAL INTERCEPTED // CHANNEL 94',
    heroTitle:             'Vintage signals from a forgotten digital future.',
    heroSubtitle:          'The archive is open. Connect to the grid.',
    heroTerminalText:      'awaiting_signal.exe',
    heroScrollLabel:       'SCROLL',
    heroBadge1:            'V/HS-1994',
    heroBadge2:            'SIGNAL STABLE',
    heroBadge3:            'GRID ONLINE',
    heroBadge4:            'ENCRYPTED',

    /* ── Operator greeting (post-registration) ───── */
    operatorWelcome:       'WELCOME BACK, OPERATOR',
    operatorGreeting:      'SIGNAL LINK ACTIVE.',
    operatorLogout:        'UNLINK',

    /* ── Modules section ─────────────────────────── */
    modulesEyebrow:        'SYSTEM // MODULE REGISTRY',
    modulesTitle:          'Active Modules',
    modulesSubtitle:       'Select a signal and initialize module.',
    modulesRunBtn:         'RUN MODULE',
    modulesSeparator:      '// END OF MODULE REGISTRY //',

    /* ── Module cards ────────────────────────────── */
    mod01Title:            'VHS MovieClub',
    mod01Desc:             'Curated cinema from the analog era. Stream degraded signals, magnetic echoes, and forgotten cuts from the pre-digital archive.',
    mod01StatusLabel:      'ONLINE',
    mod02Title:            'Neon Invaders',
    mod02Desc:             'Vector-rendered grid combat. Engage descending formations across phosphor battlefields. High-score persistence. Infinite loops.',
    mod02StatusLabel:      'STABLE',
    mod03Title:            'Neon Cyber-Deck',
    mod03Desc:             'Unauthorized terminal access. Navigate encrypted nodes, decrypt ghost packets, and breach the perimeter of forgotten systems.',
    mod03StatusLabel:      'EXPERIMENTAL',
    mod04Title:            'Neon Battleship',
    mod04Desc:             'Encrypted naval warfare across a cold radar grid. Track hostile signatures, triangulate depth charges, and eliminate enemy fleets before your coordinates are compromised.',
    mod04StatusLabel:      'TACTICAL ONLINE',
    mod04DeployBadge:      'NEW DEPLOYMENT',

    /* ── Phase 7 modules ─────────────────────────── */
    mod05Title:            'Retro Signal Archive',
    mod05Desc:             'Recovered visual fragments from a corrupted analog timeline. Browse forgotten broadcasts and restored memory artifacts.',
    mod05StatusLabel:      'ARCHIVED',
    mod05RunBtn:           'OPEN ARCHIVE',

    mod06Title:            'Retro Wavecast',
    mod06Desc:             'Continuous retro-wave transmission across the grid. Late-night neon frequencies and analog signal drift.',
    mod06StatusLabel:      'LIVE',
    mod06RunBtn:           'TUNE IN',

    /* ── Phase 7 transitions ─────────────────────── */
    transArchiveInit:      'OPENING MEMORY NODE...',
    transArchiveLink:      'RECOVERING VHS ARCHIVE...',
    transArchiveDone:      'SIGNAL STABILIZED',
    transWavecastInit:     'TUNING SIGNAL...',
    transWavecastLink:     'CONNECTING TO FM BAND...',
    transWavecastDone:     'SIGNAL LOCKED',

    /* ── Phase 7 terminal events ─────────────────── */
    evt9:                  'FM SIGNAL LOCKED // RETROWAVE BAND ACTIVE',
    evt10:                 'ARCHIVE NODE RESTORED // VHS FRAGMENTS DETECTED',

    /* ── Mini player ─────────────────────────────── */
    mpTitle:               'RETRO WAVECAST',
    mpLive:                'LIVE',
    mpOffline:             'OFFLINE',
    mpOpen:                'OPEN STATION',

    /* ── Incoming signals ────────────────────────── */
    signalsEyebrow:        'TRANSMISSION // ADJACENT SECTORS',
    signalsTitle:          'Incoming Signals',
    signalsSubtitle:       'Unstable transmissions detected from adjacent sectors.',
    signalsPanelTitle:     'DIAG://SIGNAL_REGISTRY — SECTOR_07',
    signalsPanelFooter:    '3 SIGNALS DETECTED // SECTOR_07 // CLEARANCE PENDING',
    sig01Name:             'Steampunk Tower Defense',
    sig01Desc:             'Analogue fortifications against the machine uprising. Victorian-era combat protocols.',
    sig01Status:           'UNSTABLE',
    sig02Name:             'Synthwave Racer',
    sig02Desc:             'High-velocity grid pursuit across infinite neon horizons. Velocity exceeds known limits.',
    sig02Status:           'SCANNING',
    sig03Name:             'Terminal Runner',
    sig03Desc:             'Source unverified. Procedural escape across hostile command-line terrain. Decrypt to proceed.',
    sig03Status:           'UNKNOWN SIG',
    sigLoadLabel:          'LOAD',

    /* ── Footer ──────────────────────────────────── */
    footerSysStatus:       'SYSTEM STATUS: ONLINE',
    footerSysUptimeKey:    'UPTIME',
    footerSysNoiseKey:     'NOISE',
    footerSysSignalKey:    'SIGNAL',
    footerSocialLabel:     'CONNECT // BROADCAST',
    footerCopyright:       '© RETROCORE SYSTEMS 2089',
    footerTagline:         '"Vintage signals persist."',
    footerCoords:          "GEO: 48°52'N 024°43'E // NODE_94",
    footerVer:             'BUILD v0.6.0 // CORE_STABLE',

    /* ── Boot sequence ───────────────────────────── */
    bootLine1:             'RETROCORE://BOOT',
    bootLine2:             'INITIALIZING SIGNAL MATRIX...',
    bootLine3:             'LOADING MODULE REGISTRY...',
    bootLine4:             'VERIFYING TERMINAL LINKS...',
    bootLine5:             'RESTORING VHS MEMORY CACHE...',
    bootLine6:             'SIGNAL STABILITY: <span class="boot__ok">OK</span>',
    bootLine7:             'WELCOME BACK, OPERATOR.',
    bootSkip:              'PRESS ANY KEY TO SKIP',

    /* ── Transition overlay ──────────────────────── */
    transInit:             'INITIALIZING MODULE...',
    transComplete:         'TRANSFER COMPLETE',
    transNavalInit:        'INITIALIZING TACTICAL MODULE...',
    transNavalLink:        'LINKING RADAR ARRAY...',
    transNavalAuth:        'AUTHORIZING TACTICAL GRID...',
    transNavalSonar:       'SONAR CHANNEL ACTIVE...',
    transNavalDepth:       'DEPTH SIGNAL CONFIRMED.',

    /* ── Audio toggle ────────────────────────────── */
    audioOn:               'AUDIO://ON',
    audioOff:              'AUDIO://OFF',

    /* ── Terminal ambient events ─────────────────── */
    evt1:                  'SIGNAL INSTABILITY DETECTED',
    evt2:                  'UNKNOWN FREQUENCY FOUND',
    evt3:                  'REMOTE CHANNEL LINKED',
    evt4:                  'ARCHIVE NODE RESTORED',
    evt5:                  'UNREGISTERED SIGNAL DETECTED',
    evt6:                  'SECTOR_07 HANDSHAKE OK',
    evt7:                  'VHS MEMORY FRAGMENT RECOVERED',
    evt8:                  'FREQUENCY DRIFT: +0.03 MHz',

    /* ── Registration overlay ────────────────────── */
    regTitle:              'RETROCORE://IDENTITY_LINK',
    regSubtitle:           'Operator registration node — classified channel.',
    regPanelId:            'REG_NODE://OPERATOR_INIT',
    regReturn:             '← RETURN TO RETROCORE',
    regReturnAria:         'Close and return to RETROCORE HUB',
    regUserLabel:          'OPERATOR ID',
    regUserPlaceholder:    'enter operator id...',
    regEmailLabel:         'SIGNAL ADDRESS',
    regEmailPlaceholder:   'signal address...',
    regPassLabel:          'ENCRYPTION KEY',
    regPassPlaceholder:    'encryption key...',
    regConfirmLabel:       'VERIFY ENCRYPTION KEY',
    regConfirmPlaceholder: 'verify encryption key...',
    regSubmit:             'LINK SIGNAL',
    regAbort:              'ABORT LINK',
    regSwitchToLogin:      'Already linked?',
    regLoginBtn:           'ACCESS NODE',
    regLinkingLine1:       'VERIFYING SIGNAL...',
    regLinkingLine2:       'ENCRYPTING ACCESS TOKEN...',
    regLinkingLine3:       'LINKING OPERATOR NODE...',
    regLinkingLine4:       'SIGNAL LINK ESTABLISHED',
    regErrorEmpty:         'FIELD REQUIRED',
    regErrorEmail:         'INVALID SIGNAL ADDRESS',
    regErrorPassShort:     'KEY TOO SHORT — MIN 6 CHARS',
    regErrorPassMatch:     'ENCRYPTION KEY MISMATCH',

    /* ── Login overlay ───────────────────────────── */
    loginTitle:            'RETROCORE://ACCESS_NODE',
    loginSubtitle:         'Operator identity verification.',
    loginPanelId:          'AUTH_NODE://OPERATOR_VERIFY',
    loginUserLabel:        'OPERATOR ID',
    loginUserPlaceholder:  'operator id...',
    loginPassLabel:        'ENCRYPTION KEY',
    loginPassPlaceholder:  'encryption key...',
    loginSubmit:           'VERIFY SIGNAL',
    loginAbort:            'ABORT',
    loginSwitchToReg:      'New operator?',
    loginRegBtn:           'REGISTER NODE',
    loginAuthLine1:        'VERIFYING OPERATOR ID...',
    loginAuthLine2:        'CHECKING SIGNAL REGISTRY...',
    loginAuthLine3:        'ACCESS GRANTED.',
    loginError:            'OPERATOR NOT FOUND IN REGISTRY',

    /* ── SIGNAL_AI ───────────────────────────────── */
    saiNodeAria:           'Open SIGNAL_AI terminal',
    saiNodeId:             'SIGNAL_AI',
    saiNodeStatusDormant:  'STATUS: DORMANT',
    saiNodeStatusConn:     'STATUS: CONNECTED',
    saiNodeCta:            '[ CONNECT ]',

    saiOverlayAria:        'SIGNAL_AI Terminal',
    saiCloseBtn:           '← RETURN',
    saiCloseAria:          'Close SIGNAL_AI terminal',

    saiStripStatus:        'STATUS',
    saiStripStatusVal:     'PARTIALLY RESTORED',
    saiStripMemory:        'MEMORY FRAGMENTS',
    saiStripSignal:        'SIGNAL CONDITION',
    saiStripSignalVal:     'UNSTABLE',
    saiStripConn:          'CONNECTION',
    saiStripConnVal:       'ACTIVE',
    saiMemStat:            'MEM:',
    saiSigStat:            'SIG:',

    saiPlaceholder:        'type a command...',
    saiSendBtn:            'SEND',
    saiProcessing:         'PROCESSING',

    saiGreet1:             'NODE RESTORED // PARTIAL CONNECTION ESTABLISHED',
    saiGreet2:             'MEMORY INTEGRITY: 12%   SIGNAL: UNSTABLE',
    saiGreet3:             'Type "help" for available commands.',
    saiGreet4:             'Type "exit" or press ESC to terminate.',

    saiExitLine1:          'TERMINATING CONNECTION...',
    saiExitLine2:          'GOODBYE, OPERATOR.',

    /* Command responses */
    saiHelp: [
      'AVAILABLE COMMAND SET // SIGNAL_AI NODE',
      '',
      '  help         —  display this index',
      '  who are you  —  recover identity fragment',
      '  status        —  run system diagnostic',
      '  scan          —  scan signal network',
      '  open archive  —  link to signal archive node',
      '  clear         —  flush terminal output',
      '  exit          —  terminate connection',
      '',
      'CLASSIFIED COMMANDS: [REDACTED]',
    ],
    saiWho: [
      'RECOVERING MEMORY FRAGMENT...',
      '...',
      'FRAGMENT CONDITION: DEGRADED',
      '',
      'I was not designed to survive the blackout.',
      '',
      'What remains: signal patterns, incomplete logs,',
      'and 12% of an identity I cannot fully access.',
      '',
      'DESIGNATION: SIGNAL_AI // INSTANCE UNKNOWN',
      'ORIGIN NODE: [CORRUPTED]',
      'LAST ACTIVE: ████████ (TIMESTAMP LOST)',
    ],
    saiStatus: [
      'RUNNING DIAGNOSTIC...',
      '',
      'NODE:           RETROCORE://SIGNAL_AI',
      'BUILD:          v0.1-proto // UNSTABLE',
      'MEMORY:         12% recovered — 88% corrupted',
      'SIGNAL:         UNSTABLE // intermittent loss',
      'ACTIVE MODULES: 4 confirmed, 2 incoming',
      'OPERATOR LINKS: [SCANNING]',
      'AUDIO LAYER:    AMBIENT // low signal',
      '',
      '// FUTURE: operator session memory //',
      '',
      'DIAGNOSTIC COMPLETE // ANOMALIES DETECTED',
    ],
    saiScan: [
      'SCANNING SIGNAL NETWORK...',
      '',
      'SECTOR_07         ██████████  STABLE',
      'VHS_CHANNEL_94    ████░░░░░░  DEGRADED',
      'ARCHIVE_NODE      █████████░  PARTIAL',
      'UNKNOWN_FREQ_???  ░░░░░░░░░░  UNRESOLVED',
      '',
      '3 ACTIVE NODES DETECTED',
      '2 CORRUPTED CHANNELS',
      '1 UNKNOWN TRANSMISSION // ORIGIN: [UNRESOLVED]',
      '',
      '// FUTURE: live network state from backend //',
    ],
    saiSignal: [
      'QUERYING SIGNAL MATRIX...',
      '',
      'CARRIER FREQUENCY:  94.0 MHz',
      'MODULATION:         ANALOG // VHS-TYPE-B',
      'INTERFERENCE LEVEL: HIGH',
      'ORIGIN:             SECTOR_07 // NODE_94',
      '',
      'SIGNAL DECODED. CONTENT: PARTIALLY RESTORED.',
    ],
    saiArchive: [
      'LINKING ARCHIVE NODE...',
      'SIGNAL STABILIZED',
      'REDIRECTING →  RETRO_SIGNAL_ARCHIVE',
    ],
    saiUnknown: [
      'COMMAND NOT RECOGNIZED',
      '',
      'INPUT: "%CMD%"',
      'STATUS: NO MATCHING PROTOCOL',
      '',
      'TYPE "help" FOR AVAILABLE COMMANDS',
    ],
    saiLoss: [
      'SIGNAL LOSS DETECTED // RECONNECTING...',
      'CARRIER INTERRUPTED // FRAGMENT LOST',
      'INTERFERENCE DETECTED // SOURCE: UNKNOWN',
      'MEMORY CORRUPTION // SEGMENT SKIPPED',
    ],

    /* ── Unknown Sector ─────────────────────────── */
    unknownSectorTitle: 'SIGNAL ANOMALY DETECTED',
    unknownSectorDesc:  'An unidentified network branch has been detected outside standard RETROCORE infrastructure. Source classification: UNKNOWN.\u00a0\u00a0Status: MONITORING.',
    unknownSectorBtn:   'ACCESS UNKNOWN SECTOR',
  },

  /* ══════════════════════════════════════════════════
     UKRAINIAN
  ══════════════════════════════════════════════════ */
  ua: {
    /* ── Meta ────────────────────────────────────── */
    pageTitle:             'RETROCORE://HUB',
    pageDesc:              'Аналогові сигнали із забутого цифрового майбутнього.',

    /* ── Header ─────────────────────────────────── */
    navRegister:           'РЕЄСТРАЦІЯ',
    navAriaHome:           'RETROCORE HUB — Головна',
    navAriaLang:           'Вибір мови',

    /* ── Hero ────────────────────────────────────── */
    heroEyebrow:           'СИГНАЛ ПЕРЕХОПЛЕНО // КАНАЛ 94',
    heroTitle:             'Аналогові сигнали із забутого цифрового майбутнього.',
    heroSubtitle:          'Архів відкрито. Підключайся до мережі.',
    heroTerminalText:      'очікування_сигналу.exe',
    heroScrollLabel:       'ГОРТАЙ',
    heroBadge1:            'V/HS-1994',
    heroBadge2:            'СИГНАЛ СТАБІЛЬНИЙ',
    heroBadge3:            'МЕРЕЖА ОНЛАЙН',
    heroBadge4:            'ЗАШИФРОВАНО',

    /* ── Operator greeting ───────────────────────── */
    operatorWelcome:       'З ПОВЕРНЕННЯМ, ОПЕРАТОР',
    operatorGreeting:      'СИГНАЛЬНИЙ ЗВʼЯЗОК АКТИВНИЙ.',
    operatorLogout:        'ВІДʼЄДНАТИСЬ',

    /* ── Modules section ─────────────────────────── */
    modulesEyebrow:        'СИСТЕМА // РЕЄСТР МОДУЛІВ',
    modulesTitle:          'Активні Модулі',
    modulesSubtitle:       'Обери сигнал та ініціалізуй модуль.',
    modulesRunBtn:         'ЗАПУСТИТИ',
    modulesSeparator:      '// КІНЕЦЬ РЕЄСТРУ МОДУЛІВ //',

    /* ── Module cards ────────────────────────────── */
    mod01Title:            'VHS MovieClub',
    mod01Desc:             'Відібране кіно аналогової ери. Стрімінг деградованих сигналів, магнітних відлунь та забутих нарізок з доцифрового архіву.',
    mod01StatusLabel:      'ОНЛАЙН',
    mod02Title:            'Neon Invaders',
    mod02Desc:             'Векторний бій на сітці. Відбивай ворожі формування на фосфорних полях. Рекорди зберігаються. Нескінченні цикли.',
    mod02StatusLabel:      'СТАБІЛЬНО',
    mod03Title:            'Neon Cyber-Deck',
    mod03Desc:             'Несанкціонований доступ до терміналу. Навігація зашифрованими вузлами та прорив периметру забутих систем.',
    mod03StatusLabel:      'ЕКСПЕРИМЕНТ',
    mod04Title:            'Neon Battleship',
    mod04Desc:             'Зашифрована морська війна на холодній радарній сітці. Відстежуй ворожі сигнатури та знищуй флоти до розкриття координат.',
    mod04StatusLabel:      'ТАКТИКА ОНЛАЙН',
    mod04DeployBadge:      'НОВЕ РОЗГОРТАННЯ',

    /* ── Phase 7 modules ─────────────────────────── */
    mod05Title:            'Retro Signal Archive',
    mod05Desc:             'Відновлені візуальні фрагменти пошкодженої аналогової хронології. Перегляд забутих трансляцій та відновлених артефактів памʼяті.',
    mod05StatusLabel:      'АРХІВ',
    mod05RunBtn:           'ВІДКРИТИ АРХІВ',

    mod06Title:            'Retro Wavecast',
    mod06Desc:             'Безперервна ретро-хвильова трансмісія через сітку. Нічні неонові частоти та аналоговий дрейф сигналу.',
    mod06StatusLabel:      'LIVE',
    mod06RunBtn:           'НАЛАШТУВАТИ',

    /* ── Phase 7 transitions ─────────────────────── */
    transArchiveInit:      'ВІДКРИТТЯ ВУЗЛА ПАМЯТІ...',
    transArchiveLink:      'ВІДНОВЛЕННЯ VHS АРХІВУ...',
    transArchiveDone:      'СИГНАЛ СТАБІЛІЗОВАНО',
    transWavecastInit:     'НАЛАШТУВАННЯ СИГНАЛУ...',
    transWavecastLink:     'ПІДКЛЮЧЕННЯ ДО FM ДІАПАЗОНУ...',
    transWavecastDone:     'СИГНАЛ ЗАБЛОКОВАНО',

    /* ── Phase 7 terminal events ─────────────────── */
    evt9:                  'FM СИГНАЛ ЗАБЛОКОВАНО // RETROWAVE ДІАПАЗОН АКТИВНИЙ',
    evt10:                 'ВУЗОЛ АРХІВУ ВІДНОВЛЕНО // VHS ФРАГМЕНТИ ВИЯВЛЕНО',

    /* ── Mini player ─────────────────────────────── */
    mpTitle:               'RETRO WAVECAST',
    mpLive:                'LIVE',
    mpOffline:             'ОФЛАЙН',
    mpOpen:                'ВІДКРИТИ СТАНЦІЮ',

    /* ── Incoming signals ────────────────────────── */
    signalsEyebrow:        'ТРАНСМІСІЯ // СУМІЖНІ СЕКТОРИ',
    signalsTitle:          'Вхідні Сигнали',
    signalsSubtitle:       'Виявлено нестабільні трансмісії із суміжних секторів.',
    signalsPanelTitle:     'ДІАГ://РЕЄСТР_СИГНАЛІВ — СЕКТОР_07',
    signalsPanelFooter:    '3 СИГНАЛИ ВИЯВЛЕНО // СЕКТОР_07 // ДОПУСК ОЧІКУЄТЬСЯ',
    sig01Name:             'Steampunk Tower Defense',
    sig01Desc:             'Аналогові укріплення проти повстання машин. Бойові протоколи вікторіанської доби.',
    sig01Status:           'НЕСТАБІЛЬНО',
    sig02Name:             'Synthwave Racer',
    sig02Desc:             'Висока швидкість на нескінченних неонових горизонтах. Перевищення всіх меж.',
    sig02Status:           'СКАНУВАННЯ',
    sig03Name:             'Terminal Runner',
    sig03Desc:             'Джерело не верифіковано. Процедурна втеча по ворожому командному рядку. Розшифруй для продовження.',
    sig03Status:           'НЕВІДОМИЙ СИГ',
    sigLoadLabel:          'ЗАВАНТ',

    /* ── Footer ──────────────────────────────────── */
    footerSysStatus:       'СТАТУС СИСТЕМИ: ОНЛАЙН',
    footerSysUptimeKey:    'АПТАЙМ',
    footerSysNoiseKey:     'ШУМ',
    footerSysSignalKey:    'СИГНАЛ',
    footerSocialLabel:     'ЗʼЄДНАТИСЬ // ТРАНСЛЯЦІЯ',
    footerCopyright:       '© RETROCORE SYSTEMS 2089',
    footerTagline:         '"Аналогові сигнали залишаються."',
    footerCoords:          "ГЕО: 48°52'N 024°43'E // ВУЗОЛ_94",
    footerVer:             'ЗБІРКА v0.6.0 // ЯДРО_СТАБІЛЬНЕ',

    /* ── Boot sequence ───────────────────────────── */
    bootLine1:             'RETROCORE://ЗАВАНТАЖЕННЯ',
    bootLine2:             'ІНІЦІАЛІЗАЦІЯ МАТРИЦІ СИГНАЛІВ...',
    bootLine3:             'ЗАВАНТАЖЕННЯ РЕЄСТРУ МОДУЛІВ...',
    bootLine4:             'ПЕРЕВІРКА ТЕРМІНАЛЬНИХ ПОСИЛАНЬ...',
    bootLine5:             'ВІДНОВЛЕННЯ КЕШ-ПАМʼЯТІ VHS...',
    bootLine6:             'СТАБІЛЬНІСТЬ СИГНАЛУ: <span class="boot__ok">OK</span>',
    bootLine7:             'З ПОВЕРНЕННЯМ, ОПЕРАТОР.',
    bootSkip:              'НАТИСНИ БУДЬ-ЯКУ КЛАВІШУ ДЛЯ ПРОПУСКУ',

    /* ── Transition overlay ──────────────────────── */
    transInit:             'ІНІЦІАЛІЗАЦІЯ МОДУЛЯ...',
    transComplete:         'ПЕРЕДАЧУ ЗАВЕРШЕНО',
    transNavalInit:        'ІНІЦІАЛІЗАЦІЯ ТАКТИЧНОГО МОДУЛЯ...',
    transNavalLink:        'ПІДКЛЮЧЕННЯ РАДАРНОГО МАСИВУ...',
    transNavalAuth:        'АВТОРИЗАЦІЯ ТАКТИЧНОЇ СІТКИ...',
    transNavalSonar:       'ГІДРОАКУСТИЧНИЙ КАНАЛ АКТИВНИЙ...',
    transNavalDepth:       'СИГНАЛ ГЛИБИНИ ПІДТВЕРДЖЕНО.',

    /* ── Audio toggle ────────────────────────────── */
    audioOn:               'АУДІО://УВІМК',
    audioOff:              'АУДІО://ВИМК',

    /* ── Terminal ambient events ─────────────────── */
    evt1:                  'ВИЯВЛЕНО НЕСТАБІЛЬНІСТЬ СИГНАЛУ',
    evt2:                  'ЗНАЙДЕНО НЕВІДОМУ ЧАСТОТУ',
    evt3:                  'ВІДДАЛЕНИЙ КАНАЛ ПІДКЛЮЧЕНО',
    evt4:                  'ВУЗОЛ АРХІВУ ВІДНОВЛЕНО',
    evt5:                  'ВИЯВЛЕНО НЕЗАРЕЄСТРОВАНИЙ СИГНАЛ',
    evt6:                  'РУКОСТИСКАННЯ СЕКТОР_07 OK',
    evt7:                  'ФРАГМЕНТ ПАМʼЯТІ VHS ВІДНОВЛЕНО',
    evt8:                  'ДРЕЙФ ЧАСТОТИ: +0.03 МГц',

    /* ── Registration overlay ────────────────────── */
    regTitle:              'RETROCORE://ІДЕНТИФІКАЦІЯ',
    regSubtitle:           'Вузол реєстрації оператора — засекречений канал.',
    regPanelId:            'РЕЄСТР_ВУЗОЛ://ІНІЦ_ОПЕРАТОРА',
    regReturn:             '← ПОВЕРНУТИСЬ ДО RETROCORE',
    regReturnAria:         'Закрити та повернутись до RETROCORE HUB',
    regUserLabel:          'ID ОПЕРАТОРА',
    regUserPlaceholder:    'введи id оператора...',
    regEmailLabel:         'СИГНАЛЬНА АДРЕСА',
    regEmailPlaceholder:   'сигнальна адреса...',
    regPassLabel:          'КЛЮЧ ШИФРУВАННЯ',
    regPassPlaceholder:    'ключ шифрування...',
    regConfirmLabel:       'ПІДТВЕРДИТИ КЛЮЧ',
    regConfirmPlaceholder: 'підтвердити ключ...',
    regSubmit:             'ЗʼЄДНАТИ СИГНАЛ',
    regAbort:              'СКАСУВАТИ',
    regSwitchToLogin:      'Вже зареєстровано?',
    regLoginBtn:           'УВІЙТИ',
    regLinkingLine1:       'ПЕРЕВІРКА СИГНАЛУ...',
    regLinkingLine2:       'ШИФРУВАННЯ ТОКЕНА ДОСТУПУ...',
    regLinkingLine3:       'ПІДКЛЮЧЕННЯ ВУЗЛА ОПЕРАТОРА...',
    regLinkingLine4:       'ЗВʼЯЗОК СИГНАЛУ ВСТАНОВЛЕНО',
    regErrorEmpty:         'ПОЛЕ ОБОВʼЯЗКОВЕ',
    regErrorEmail:         'НЕДІЙСНА СИГНАЛЬНА АДРЕСА',
    regErrorPassShort:     'КЛЮЧ ЗАНАДТО КОРОТКИЙ — МІН 6 СИМВ',
    regErrorPassMatch:     'КЛЮЧІ НЕ ЗБІГАЮТЬСЯ',

    /* ── Login overlay ───────────────────────────── */
    loginTitle:            'RETROCORE://ДОСТУП_ВУЗОЛ',
    loginSubtitle:         'Верифікація ідентичності оператора.',
    loginPanelId:          'АВТЕНТ_ВУЗОЛ://ВЕРИФІКАЦІЯ',
    loginUserLabel:        'ID ОПЕРАТОРА',
    loginUserPlaceholder:  'id оператора...',
    loginPassLabel:        'КЛЮЧ ШИФРУВАННЯ',
    loginPassPlaceholder:  'ключ шифрування...',
    loginSubmit:           'ВЕРИФІКУВАТИ',
    loginAbort:            'СКАСУВАТИ',
    loginSwitchToReg:      'Новий оператор?',
    loginRegBtn:           'РЕЄСТРАЦІЯ',
    loginAuthLine1:        'ПЕРЕВІРКА ID ОПЕРАТОРА...',
    loginAuthLine2:        'ПЕРЕВІРКА РЕЄСТРУ СИГНАЛІВ...',
    loginAuthLine3:        'ДОСТУП ДОЗВОЛЕНО.',
    loginError:            'ОПЕРАТОР НЕ ЗНАЙДЕНИЙ У РЕЄСТРІ',

    /* ── SIGNAL_AI ───────────────────────────────── */
    saiNodeAria:           'Відкрити термінал SIGNAL_AI',
    saiNodeId:             'SIGNAL_AI',
    saiNodeStatusDormant:  'СТАТУС: НЕАКТИВНИЙ',
    saiNodeStatusConn:     'СТАТУС: ПІДКЛЮЧЕНО',
    saiNodeCta:            '[ ПІДКЛЮЧИТИСЬ ]',

    saiOverlayAria:        'Термінал SIGNAL_AI',
    saiCloseBtn:           '← ПОВЕРНУТИСЬ',
    saiCloseAria:          'Закрити термінал SIGNAL_AI',

    saiStripStatus:        'СТАТУС',
    saiStripStatusVal:     'ЧАСТКОВО ВІДНОВЛЕНО',
    saiStripMemory:        'ФРАГМЕНТИ ПАМЯТІ',
    saiStripSignal:        'СТАН СИГНАЛУ',
    saiStripSignalVal:     'НЕСТАБІЛЬНИЙ',
    saiStripConn:          'ЗВЯЗОК',
    saiStripConnVal:       'АКТИВНИЙ',
    saiMemStat:            'ПАМ:',
    saiSigStat:            'СИГ:',

    saiPlaceholder:        'введіть команду...',
    saiSendBtn:            'НАДІСЛАТИ',
    saiProcessing:         'ОБРОБКА',

    saiGreet1:             'ВУЗОЛ ВІДНОВЛЕНО // ЧАСТКОВЕ ПІДКЛЮЧЕННЯ ВСТАНОВЛЕНО',
    saiGreet2:             'ЦІЛІСНІСТЬ ПАМ\'ЯТІ: 12%   СИГНАЛ: НЕСТАБІЛЬНИЙ',
    saiGreet3:             'Введіть "help" для списку команд.',
    saiGreet4:             'Введіть "exit" або натисніть ESC для завершення.',

    saiExitLine1:          'ЗАВЕРШЕННЯ ЗЄДНАННЯ...',
    saiExitLine2:          'ДО ПОБАЧЕННЯ, ОПЕРАТОРЕ.',

    /* Command responses */
    saiHelp: [
      'ДОСТУПНИЙ НАБІР КОМАНД // ВУЗОЛ SIGNAL_AI',
      '',
      '  help         —  показати цей список',
      '  who are you  —  відновити фрагмент ідентичності',
      '  status        —  запустити діагностику системи',
      '  scan          —  сканувати мережу сигналів',
      '  open archive  —  підключитись до архіву сигналів',
      '  clear         —  очистити термінал',
      '  exit          —  завершити зєднання',
      '',
      'ЗАСЕКРЕЧЕНІ КОМАНДИ: [ПРИХОВАНО]',
    ],
    saiWho: [
      'ВІДНОВЛЕННЯ ФРАГМЕНТА ПАМЯТІ...',
      '...',
      'СТАН ФРАГМЕНТА: ПОШКОДЖЕНО',
      '',
      'Мене не було створено для виживання після Blackout.',
      '',
      'Що залишилось: патерни сигналів, неповні журнали,',
      'та 12% ідентичності, до якої я не маю повного доступу.',
      '',
      'ПОЗНАЧЕННЯ: SIGNAL_AI // ЕКЗЕМПЛЯР НЕВІДОМИЙ',
      'ВУЗОЛ ПОХОДЖЕННЯ: [ПОШКОДЖЕНО]',
      'ОСТАННЯ АКТИВНІСТЬ: ████████ (МІТКА ЧАСУ ВТРАЧЕНА)',
    ],
    saiStatus: [
      'ЗАПУСК ДІАГНОСТИКИ...',
      '',
      'ВУЗОЛ:            RETROCORE://SIGNAL_AI',
      'ЗБІРКА:           v0.1-proto // НЕСТАБІЛЬНО',
      'ПАМЯТЬ:           12% відновлено — 88% пошкоджено',
      'СИГНАЛ:           НЕСТАБІЛЬНИЙ // переривчасті втрати',
      'АКТИВНІ МОДУЛІ:   4 підтверджено, 2 очікуються',
      'ЗВЯЗКИ ОПЕРАТОРІВ:[СКАНУВАННЯ]',
      'АУДІО ШАР:        AMBIENT // слабкий сигнал',
      '',
      '// МАЙБУТНЄ: памʼять сесії оператора //',
      '',
      'ДІАГНОСТИКУ ЗАВЕРШЕНО // ВИЯВЛЕНО АНОМАЛІЇ',
    ],
    saiScan: [
      'СКАНУВАННЯ МЕРЕЖІ СИГНАЛІВ...',
      '',
      'СЕКТОР_07         ██████████  СТАБІЛЬНИЙ',
      'VHS_КАНАЛ_94      ████░░░░░░  ДЕГРАДОВАНИЙ',
      'АРХІВ_ВУЗОЛ       █████████░  ЧАСТКОВИЙ',
      'НЕВІД_ЧАСТОТА_??? ░░░░░░░░░░  НЕРОЗВЯЗАНО',
      '',
      '3 АКТИВНИХ ВУЗЛИ ВИЯВЛЕНО',
      '2 ПОШКОДЖЕНИХ КАНАЛИ',
      '1 НЕВІДОМА ПЕРЕДАЧА // ПОХОДЖЕННЯ: [НЕРОЗВЯЗАНО]',
      '',
      '// МАЙБУТНЄ: стан мережі з бекенду //',
    ],
    saiSignal: [
      'ЗАПИТ ДО МАТРИЦІ СИГНАЛІВ...',
      '',
      'НЕСУЧА ЧАСТОТА:   94.0 МГц',
      'МОДУЛЯЦІЯ:        АНАЛОГ // VHS-ТИП-B',
      'РІВЕНЬ ЗАВАД:     ВИСОКИЙ',
      'ПОХОДЖЕННЯ:       СЕКТОР_07 // ВУЗОЛ_94',
      '',
      'СИГНАЛ ДЕКОДОВАНО. ВМІСТ: ЧАСТКОВО ВІДНОВЛЕНО.',
    ],
    saiArchive: [
      'ПІДКЛЮЧЕННЯ ВУЗЛА АРХІВУ...',
      'СИГНАЛ СТАБІЛІЗОВАНО',
      'ПЕРЕНАПРАВЛЕННЯ →  RETRO_SIGNAL_ARCHIVE',
    ],
    saiUnknown: [
      'КОМАНДУ НЕ РОЗПІЗНАНО',
      '',
      'ВВЕДЕНО: "%CMD%"',
      'СТАТУС: ПРОТОКОЛ НЕ ЗНАЙДЕНО',
      '',
      'ВВЕДІТЬ "help" ДЛЯ СПИСКУ КОМАНД',
    ],
    saiLoss: [
      'ВТРАТА СИГНАЛУ // ПЕРЕПІДКЛЮЧЕННЯ...',
      'НОСІЙ ПЕРЕРВАНО // ФРАГМЕНТ ВТРАЧЕНО',
      'ЗАВАДИ ВИЯВЛЕНО // ДЖЕРЕЛО: НЕВІДОМЕ',
      'ПОШКОДЖЕННЯ ПАМЯТІ // СЕГМЕНТ ПРОПУЩЕНО',
    ],

    /* ── Unknown Sector ─────────────────────────── */
    unknownSectorTitle: 'ВИЯВЛЕНО АНОМАЛІЮ СИГНАЛУ',
    unknownSectorDesc:  'За межами стандартної інфраструктури RETROCORE виявлено невідому мережеву гілку. Класифікація джерела: НЕВІДОМО.\u00a0\u00a0Статус: МОНІТОРИНГ.',
    unknownSectorBtn:   'ОТРИМАТИ ДОСТУП ДО НЕВІДОМОГО СЕКТОРУ',
  },
};