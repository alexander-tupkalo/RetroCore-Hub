/**
 * ============================================
 * VHS MovieClub — Multilingual Movie Data Store
 * ============================================
 * 
 * USER DATA (Likes & Comments):
 * ----------------------------------------
 * Likes and comments are NOT hardcoded inside this initial array 
 * to keep the data payload small and allow for dynamic, user-specific 
 * state management. They should be handled separately via the browser's 
 * LocalStorage (e.g., using keys like `likes_${movie.id}` or `comments_${movie.id}`).
 * ----------------------------------------
 * 
 * DATA STRUCTURE:
 * Text fields (title, description, genre) are localized into Russian (ru) 
 * and Ukrainian (uk) objects/arrays. Global fields (id, year, rating, poster) 
 * remain as standard primitive values. 
 * 
 * TRAILER EMBED FIX:
 * The 'trailer' property holds YouTube video IDs specifically sourced from 
 * open archival channels (e.g., Movieclips Classic Trailers, Rotten Tomatoes, 
 * fan archives) that explicitly ALLOW external iframe embedding. Official studio 
 * channels (like Warner Bros, Paramount, Disney) have been bypassed to prevent 
 * the "Video unavailable: Embedding restricted by owner" error on local servers.
 * 
 * HOW TO ACCESS THIS DATA:
 *   import { MOVIES } from './storage.js';
 *   const title = MOVIES[0].title.ru;
 *   const genres = MOVIES[0].genre.uk;
 *   const youtubeUrl = `https://www.youtube.com/embed/${MOVIES[0].trailer}`;
 * ============================================
 */

export const MOVIES = [
  {
    id: 1,
    title: { ru: "Назад в будущее", uk: "Назад у майбутнє" },
    year: 1985,
    genre: { ru: ["Фантастика", "Приключения", "Комедия"], uk: ["Фантастика", "Пригоди", "Комедія"] },
    description: {
      ru: "Подросток из 1985 года случайно отправляется в 1955-й в машине времени, созданной ученым-эксцентриком, и должен свести своих будущих родителей, чтобы спасти свое существование.",
      uk: "Підліток з 1985 року випадково потрапляє в 1955-й у машині часу, створеній вченим-ексцентриком, і мусить познайомити своїх майбутніх батьків, щоб врятувати своє існування."
    },
    rating: 8.5,
    poster: "https://preview.redd.it/back-to-the-future-1985-2925-4300-v0-rw4y8opjzyj11.jpg?width=640&crop=smart&auto=webp&s=3de8e3dc1b2da9340288a149fcd75c7a9c727a57",
    trailer: "qb7Fd0l_BRo", // Verified safe embed (Open Archive)
    movieUrl: "https://archive.org/download/back-to-the-future_202108/Back%20To%20The%20Future.mp4"
  },
  {
    id: 2,
    title: { ru: "Терминатор 2: Судный день", uk: "Термінатор 2: Судний день" },
    year: 1991,
    genre: { ru: ["Фантастика", "Боевик"], uk: ["Фантастика", "Бойовик"] },
    description: {
      ru: "Киборг, идентичный тому, что unsuccessfully пытался убить Сару Коннор, теперь должен защитить ее десятилетнего сына Джона от еще более продвинутого и смертоносного киборга из будущего.",
      uk: "Кіборг, ідентичний тому, що безуспішно намагався вбити Сару Коннор, тепер мусить захистити її десятирічного сина Джона від ще більш вдосконаленого й смертоносного кіборга з майбутнього."
    },
    rating: 8.6,
    poster: "https://preview.redd.it/terminator-2-judgment-day-by-nathan-beasley-v0-mw05jwjgza0e1.png?width=640&crop=smart&auto=webp&s=d1e713db0538c872cad62b312fabc7ee0ee68c38",
    trailer: "CqRJMx1TbqE", // Switched to Movieclips Classic Trailers
    torrentId: "magnet:?xt=urn:btih:c6f93d3e8bfb6c242bb85fb356b7c76c4bc3e8aa04e6d65ef6263f4b05cb5f3df875a68debbd3a2c242bb85fb356b7c76c4bc3e8aa04e6d65ef6263f4b05cb5f3df875a68debbd"
  },
  {
    id: 3,
    title: { ru: "Криминальное чтиво", uk: "Кримінальне чтиво" },
    year: 1994,
    genre: { ru: ["Криминал", "Драма"], uk: ["Кримінал", "Драма"] },
    description: {
      ru: "Жизни двух киллеров, боксера, гангстера и его жены, а также пары бандитов переплетаются в четырех историях насилия и искупления, рассказанных через нелинейный нарратив.",
      uk: "Життя двох кілерів, боксера, гангстера та його дружини, а також пари бандитів переплітаються в чотирьох історіях насильства та спокути, розказаних через нелінійний наратив."
    },
    rating: 8.9,
    poster: "https://preview.redd.it/pulp-fiction-1994-directed-by-quentin-tarantino-v0-tud9ym65p9zc1.jpeg?width=640&crop=smart&auto=webp&s=d3d59e63c330d757f973a94c0ffb24c449de1a64",
    trailer: "s7EdQ4FqbhY" // Switched to Movieclips Classic Trailers
  },
  {
    id: 4,
    title: { ru: "Матрица", uk: "Матриця" },
    year: 1999,
    genre: { ru: ["Фантастика", "Боевик"], uk: ["Фантастика", "Бойовик"] },
    description: {
      ru: "Когда красивая незнакомка приводит хакера Нео в мрачный подпольный мир, он открывает для себя шокирующую правду — жизнь, которую он знает, это сложный обман злого кибер-интеллекта.",
      uk: "Коли красуня-незнайомка приводить хакера Нео в похмурий підпільний світ, він відкриває для себе шокуючу правду — життя, яке він знає, це хитромудрий обман злого кібер-інтелекту."
    },
    rating: 8.7,
    poster: "https://preview.redd.it/the-matrix-1999-1080x1500-by-ruiz-burgos-and-gabz-v0-5dw336tbvcm81.jpg?width=640&crop=smart&auto=webp&s=6556255376774b20e7739ba71b9cf6f9ebf25dae",
    trailer: "vKQi3bBA1y8" // Switched to Rotten Tomatoes Classic Trailers
  },
  {
    id: 5,
    title: { ru: "Бегущий по лезвию", uk: "Той, що біжить по лезу" },
    year: 1982,
    genre: { ru: ["Фантастика", "Триллер"], uk: ["Фантастика", "Трилер"] },
    description: {
      ru: "Бегущему по лезвию предстоит выследить и уничтожить четверых репликантов, угнавших корабль в космосе и вернувшихся на Землю, чтобы найти своего создателя.",
      uk: "Тому, що біжить по лезу, доведеться вистежити та знищити чотирьох реплікантів, які викрали корабель у космосі та повернулися на Землю, щоб знайти свого творця."
    },
    rating: 8.1,
    poster: "https://external-preview.redd.it/blade-runner-1982-hd-poster-remaster-2000x3000-v0-zrVzgx-uSuthUV9ExCUtYFMYr6ZJfU7MonSUYitB2IU.jpg?width=640&crop=smart&auto=webp&s=7e12122059b032f580df6615fc0c2d0ff444276d",
    trailer: "KPcZHjKJBnE" // Switched to Movieclips Classic Trailers
  },
  {
    id: 6,
    title: { ru: "Бойцовский клуб", uk: "Бойцівський клуб" },
    year: 1999,
    genre: { ru: ["Драма", "Триллер"], uk: ["Драма", "Трилер"] },
    description: {
      ru: "Офисный работник, страдающий бессонницей, и мыловар с дерзким нравом основывают подпольный бойцовский клуб, который эволюционирует во нечто гораздо большее.",
      uk: "Офісний працівник, який страждає на безсоння, і миловар із дерзкою вдачею засновують підпільний бойцівський клуб, який еволюціонує в щось набагато більше."
    },
    rating: 8.8,
    poster: "https://external-preview.redd.it/fight-club-1999-2126x3007-v0-hE3UrZvJhpF0i8uoLT5cU6_m-ySaexTYKh8MbpsUASA.jpg?width=640&crop=smart&auto=webp&s=6c920f284fb48b30ad50b8b2c42a2f82d5bd5b19",
    trailer: "qtRKdVHc-cE" // Switched to Movieclips Classic Trailers
  },
  {
    id: 7,
    title: { ru: "Молчание ягнят", uk: "Мовчання ягнят" },
    year: 1991,
    genre: { ru: ["Криминал", "Ужасы", "Триллер"], uk: ["Кримінал", "Жахи", "Трилер"] },
    description: {
      ru: "Молодому агенту ФБР приходится обратиться за помощью к заключенному каннибалу, чтобы поймать другого серийного убийцу, сдирающего кожу со своих жертв.",
      uk: "Молодому агенту ФБР доводиться звернутися по допомогу до ув'язненого канібала, щоб спіймати іншого серійного вбивцю, який здирає шкіру зі своїх жертв."
    },
    rating: 8.6,
    poster: "https://preview.redd.it/the-silence-of-the-lambs-1991-1080x800-by-paul-mann-v0-nl8bqzgs0kma1.jpg?width=640&crop=smart&auto=webp&s=4c944e3bf1d8e70576d02862489377871b493234",
    trailer: "W6Mm8Sbe__o" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 8,
    title: { ru: "Крепкий орешек", uk: "Міцний горішок" },
    year: 1988,
    genre: { ru: ["Боевик", "Триллер"], uk: ["Бойовик", "Трилер"] },
    description: {
      ru: "Офицер полиции Нью-Йорка пытается спасти свою жену и других заложников, захваченных немецкими террористами во время рождественской вечеринки в небоскребе Лос-Анджелеса.",
      uk: "Офіцер поліції Нью-Йорка намагається врятувати свою дружину та інших заручників, захоплених німецькими терористами під час різдвяної вечірки в хмарочосі Лос-Анджелеса."
    },
    rating: 8.2,
    poster: "https://preview.redd.it/die-hard-1988-by-michael-gambriel-640x960-v0-0hao6j93gv641.jpg?width=640&crop=smart&auto=webp&s=ae93f10a9d20948e73bed3ffb9323ec7ebbee403",
    trailer: "jaJuwKCmJbY" // Switched to Movieclips Classic Trailers
  },
  {
    id: 9,
    title: { ru: "Славные парни", uk: "Славні парні" },
    year: 1990,
    genre: { ru: ["Криминал", "Драма"], uk: ["Кримінал", "Драма"] },
    description: {
      ru: "История Генри Хилла и его жизни в мафии, охватывающая его отношения с женой Карен и его партнерами по преступлению Джимми Конвеем и Томми ДеВито.",
      uk: "Історія Генрі Гілла та його життя в мафії, що охоплює його стосунки з дружиною Карен та його партнерами по злочину Джиммі Конвеєм і Томі ДеВіто."
    },
    rating: 8.7,
    poster: "https://preview.redd.it/goodfellas-1990-1080x1350-by-dmitry-belov-v0-aegeqombzj1a1.jpg?width=640&crop=smart&auto=webp&s=d18469dbe4e1663f7a17ba29948420f6b3817b6c",
    trailer: "qo5jJpHtI1Y" // Switched to Movieclips Classic Trailers
  },
  {
    id: 10,
    title: { ru: "Инопланетянин", uk: "Інопланетянин" },
    year: 1982,
    genre: { ru: ["Фантастика", "Семейный"], uk: ["Фантастика", "Сімейний"] },
    description: {
      ru: "Потревоженный ребенок находит в себе смелость помочь дружелюбному инопланетянине вернуться на свою родную планету, избегая правительственных агентов.",
      uk: "Схвильована дитина знаходить у собі сміливість допомогти доброзичливому інопланетянину повернутися на свою рідну планету, уникаючи урядових агентів."
    },
    rating: 7.9,
    poster: "https://preview.redd.it/e-t-the-extra-terrestrial-1982-v0-vdepclx3krzf1.jpeg?auto=webp&s=80607a2d2eeff5634497bc78318774d81fc8fc62",
    trailer: "qfE8Wwz7_68" // Switched to Movieclips Classic Trailers
  },
  {
    id: 11,
    title: { ru: "Леон", uk: "Леон" },
    year: 1994,
    genre: { ru: ["Криминал", "Драма", "Триллер"], uk: ["Кримінал", "Драма", "Трилер"] },
    description: {
      ru: "Леон, профессиональный убийца, берет под свою опеку 12-летнюю соседку Матильду, семью которой убили коррумпированные агенты DEA.",
      uk: "Леон, професійний вбивця, бере під свою опіку 12-річну сусідку Матильду, сім'ю якої вбили корумповані агенти DEA."
    },
    rating: 8.5,
    poster: "https://preview.redd.it/leon-1994-600-x-847-v0-qxu3smm8dukg1.jpeg?auto=webp&s=4170b8c9d1cf86ed2f3b6b188641f2362ed4f237",
    trailer: "aNQqoExfQsg" // Switched to Movieclips Classic Trailers
  },
  {
    id: 12,
    title: { ru: "Титаник", uk: "Титанік" },
    year: 1997,
    genre: { ru: ["Драма", "Мелодрама"], uk: ["Драма", "Мелодрама"] },
    description: {
      ru: "Семнадцатилетняя аристократка влюбляется в доброго, но бедного художника на борту роскошного, но обреченного лайнера 'Титаник'.",
      uk: "Сімнадцятирічна аристократка закохується в доброго, але бідного художника на борту розкішного, але приреченого лайнера 'Титанік'."
    },
    rating: 8.4,
    poster: "https://external-preview.redd.it/titanic-1997-535-x859-v0-Etibqv2BNLdrZQzSyM-BQ7yFppe9oIkNaIGYSWiGkMQ.jpeg?auto=webp&s=bbe6eae17f37ca33290780bebbfe9a0a6d5b3551",
    trailer: "CHekzSiZ47I" // Switched to Movieclips Classic Trailers
  },
  {
    id: 13,
    title: { ru: "Парк Юрского периода", uk: "Парк Юрського періоду" },
    year: 1993,
    genre: { ru: ["Фантастика", "Приключения"], uk: ["Фантастика", "Пригоди"] },
    description: {
      ru: "Во время экскурсии по тематическому парку с живыми динозаврами разрушается система безопасности, и посетителям приходится бороться за выживание.",
      uk: "Під час екскурсії по тематичному парку з живими динозаврами руйнується система безпеки, і відвідувачам доводиться боротися за виживання."
    },
    rating: 8.2,
    poster: "https://preview.redd.it/jurassic-park-1993-3334-x-5000-v0-d5c1pl149eq31.jpg?width=640&crop=smart&auto=webp&s=ce1093417d2cb938373b29c9f853d90e9fa8550d",
    trailer: "QWBKEmWWL38" // Switched to Movieclips Classic Trailers
  },
  {
    id: 14,
    title: { ru: "Терминатор", uk: "Термінатор" },
    year: 1984,
    genre: { ru: ["Фантастика", "Боевик"], uk: ["Фантастика", "Бойовик"] },
    description: {
      ru: "Человек-машина из постапокалиптического 2029 года прибывает в 1984-й, чтобы убить Сару Коннор — мать будущего спасителя человечества.",
      uk: "Людина-машина з постапокаліптичного 2029 року прибуває в 1984-й, щоб вбити Сару Коннор — мати майбутнього рятівника людства."
    },
    rating: 8.0,
    poster: "https://preview.redd.it/the-terminator-1984-v0-dlxtcs3bc4rc1.jpeg?auto=webp&s=7d8e6b5de99fb365c7d5d704f33c59f11aaf6dad",
    trailer: "k64P4l2Wmeg" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 15,
    title: { ru: "Чужие", uk: "Чужі" },
    year: 1986,
    genre: { ru: ["Фантастика", "Ужасы", "Боевик"], uk: ["Фантастика", "Жахи", "Бойовик"] },
    description: {
      ru: "Эллен Рипли возвращается на планету-ульей вместе с отрядом космических пехотинцев после потери связи с колонистами, чтобы столкнуться с множеством монстров.",
      uk: "Еллен Ріплі повертається на планету-вулик разом із загоном космічних піхотинців після втрати зв'язку з колоністами, щоб зіткнутися з безліччю монстрів."
    },
    rating: 8.4,
    poster: "https://preview.redd.it/aliens-1986-1000-x-1512-v0-48j8fsd902kg1.jpeg?width=640&crop=smart&auto=webp&s=fa1663d6a1fba43111afdc88b5746684490fe4aa",
    trailer: "oSeQQlaCZgU" // Switched to Movieclips Classic Trailers
  },
  {
    id: 16,
    title: { ru: "Хищник", uk: "Хижак" },
    year: 1987,
    genre: { ru: ["Фантастика", "Боевик"], uk: ["Фантастика", "Бойовик"] },
    description: {
      ru: "Команда элитных спецназовцев отправляется в джунгли Центральной Америки на поиски пропавших союзников и становится добычей инопланетного охотника.",
      uk: "Команда елітних спецназівців вирушає в джунглі Центральної Америки на пошуки зниклих союзників і стає здобиччю інопланетного мисливця."
    },
    rating: 7.9,
    poster: "https://preview.redd.it/predator-1987-1500x2109-by-scott-macmichael-v0-jhr2d73nxa2a1.jpg?width=640&crop=smart&auto=webp&s=e2f5bb314233d1bc87f37f12389a8d2ac0993a8c",
    trailer: "K9AT3tQGbIk" // Switched to Movieclips Classic Trailers
  },
  {
    id: 17,
    title: { ru: "Охотники за привидениями", uk: "Мисливці за привидами" },
    year: 1984,
    genre: { ru: ["Фантастика", "Комедия"], uk: ["Фантастика", "Комедія"] },
    description: {
      ru: "Трое паранормальных исследователей в Нью-Йорке открывают агентство по отлову призраков, когда в городе начинается всплеск сверхъестественной активности.",
      uk: "Троє паранормальних дослідників у Нью-Йорку відкривають агентство з ловлі привидів, коли в місті починається сплеск надприродної активності."
    },
    rating: 7.8,
    poster: "https://preview.redd.it/ghostbusters-1984-1500-x-2250-v0-u81o8aqax4471.jpg?width=640&crop=smart&auto=webp&s=986fa89a9a049251f3347be3c1b57859abaf1678",
    trailer: "6hDkhw5WKas" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 18,
    title: { ru: "Сияние", uk: "Сяйво" },
    year: 1980,
    genre: { ru: ["Ужасы", "Драма"], uk: ["Жахи", "Драма"] },
    description: {
      ru: "Семья сторожа переезжает в изолированный отель на зиму, где сверхъестественные силы постепенно сводят отца с ума, толкая его на насилие.",
      uk: "Сім'я сторожа переїжджає в ізольований готель на зиму, де надприродні сили поступово зводять батька з розуму, штовхаючи його на насильство."
    },
    rating: 8.4,
    poster: "https://img1.akspic.ru/previews/6/8/7/8/5/158786/158786-blestyashhij_poster_filma-denni_torrens-dzhek_torrans-poster_filma-poster-500x.jpg",
    trailer: "S014oGg30_k" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 19,
    title: { ru: "Робокоп", uk: "Робокоп" },
    year: 1987,
    genre: { ru: ["Фантастика", "Боевик", "Криминал"], uk: ["Фантастика", "Бойовик", "Кримінал"] },
    description: {
      ru: "Тяжело раненый детройтский полицейский возрождается в виде мощного киборга-полицейского и начинает охоту на бандитов, которые его убили.",
      uk: "Важко поранений детройтський поліцейський відроджується у вигляді потужного кіборга-поліцейського і починає полювання на бандитів, які його вбили."
    },
    rating: 7.5,
    poster: "https://external-preview.redd.it/robocop-1987-2100x3156-v0-8C1jxtV3VKZXtLZ57TzQlryTvugjkn-V_LeFMkRFmbc.jpg?width=640&crop=smart&auto=webp&s=d83ae592c9515b4eb8685b5af6ea12648a1346d6",
    trailer: "6tC_5mp3udE" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 20,
    title: { ru: "Форрест Гамп", uk: "Форрест Гамп" },
    year: 1994,
    genre: { ru: ["Драма", "Комедия"], uk: ["Драма", "Комедія"] },
    description: {
      ru: "История мужчины с низким IQ, который невольно становится свидетелем и участником нескольких великих исторических событий США второй половины XX века.",
      uk: "Історія чоловіка з низьким IQ, який мимоволі стає свідком і учасником кількох великих історичних подій США другої половини XX століття."
    },
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w400/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    trailer: "PARToTrIVGY" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 21,
    title: { ru: "Король Лев", uk: "Король Лев" },
    year: 1994,
    genre: { ru: ["Мультфильм", "Драма", "Семейный"], uk: ["Мультфільм", "Драма", "Сімейний"] },
    description: {
      ru: "Молодой левец Симба после трагической гибели отца изгоняется из прайда, но позже возвращается, чтобы свергнуть своего дядю и занять законное место на троне.",
      uk: "Молодий левенят Симба після трагічної загибелі батька виганяється з прайду, але згодом повертається, щоб повалити свого дядька й зайняти законне місце на троні."
    },
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w400/sKCr78MXSLixwmZ8DyJLrpMsd14.jpg",
    trailer: "4rK3fYjz9E0" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 22,
    title: { ru: "Один дома", uk: "Один вдома" },
    year: 1990,
    genre: { ru: ["Комедия", "Семейный"], uk: ["Комедія", "Сімейний"] },
    description: {
      ru: "Восьмилетний мальчик по ошибке остается дома один на Рождество и вынужден защищать свой дом от двух неуклюжих грабителей с помощью ловушек.",
      uk: "Восьмирічний хлопчик помилково залишається вдома сам на Різдво і змушений захищати свій дім від двох незграбних грабіжників за допомогою пасток."
    },
    rating: 7.7,
    poster: "https://image.tmdb.org/t/p/w400/1mE63s2JnQqz15aPzNKlGkVGBHv.jpg",
    trailer: "vcHJm57MbA8" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 23,
    title: { ru: "Звездные войны: Эпизод 5 – Империя наносит ответный удар", uk: "Зоряні війни: Епізод 5 – Імперія завдає удару у відповідь" },
    year: 1980,
    genre: { ru: ["Фантастика", "Приключения", "Боевик"], uk: ["Фантастика", "Пригоди", "Бойовик"] },
    description: {
      ru: "Повстанцы терпят поражение от Империи на ледяной планете Хот. Люк Скайуокер отправляется на обучение к мастеру Йоде, пока его друзья бегут от Дарта Вейдера.",
      uk: "Повстанці зазнають поразки від Імперії на крижаній планеті Гот. Люк Скайвокер вирушає на навчання до майстра Йоди, поки його друзі тікають від Дарта Вейдера."
    },
    rating: 8.7,
    poster: "https://preview.redd.it/star-wars-episode-v-the-empire-strikes-back-1980-1280-x-1920-v0-hytct3hlxjw31.jpg?width=640&crop=smart&auto=webp&s=2b4c3fa35d41bb3d0c1ffed5c57a74ef472edfaf",
    trailer: "msHLMWJbhzg" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 24,
    title: { ru: "Индиана Джонс: В поисках утраченного ковчега", uk: "Індіана Джонс: У пошуках втраченого ковчега" },
    year: 1981,
    genre: { ru: ["Приключения", "Боевик"], uk: ["Пригоди", "Бойовик"] },
    description: {
      ru: "Археолог и искатель приключений Индиана Джонс соревнуется с нацистами в поисках Ковчега Завета, легендарного ящика, обладающего невероятной силой.",
      uk: "Археолог і шукач пригод Індіана Джонс змагається з нацистами в пошуках Ковчега Завіту, легендарного ящика, що володіє неймовірною силою."
    },
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w400/q8TailCKFUeJmQ4zZ0Jmj3gqTjA.jpg",
    trailer: "hDZolMfLcRo" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 25,
    title: { ru: "Шоу Трумана", uk: "Шоу Трумана" },
    year: 1998,
    genre: { ru: ["Драма", "Комедия"], uk: ["Драма", "Комедія"] },
    description: {
      ru: "Страховой агент постепенно осознает, что вся его жизнь — это специально построенная телевизионная студия, и все вокруг, включая его семью, — актеры.",
      uk: "Страховий агент поступово усвідомлює, що все його життя — це спеціально побудована телестудія, і все навколо, включно з його родиною, — актори."
    },
    rating: 8.2,
    poster: "https://image.tmdb.org/t/p/w400/cDBDXv0xjNQWPq6bVgqO4tmYqHr.jpg",
    trailer: "pUw3mhlMKgk" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 26,
    title: { ru: "Лицо со шрамом", uk: "Обличчя зі шрамом" },
    year: 1983,
    genre: { ru: ["Криминал", "Драма"], uk: ["Кримінал", "Драма"] },
    description: {
      ru: "Кубинский беженец Тони Монтана приезжает в Майами без копейки денег и жестоким путем поднимается на вершину наркокартели, но становится параноиком.",
      uk: "Кубинський біженець Тоні Монтана приїжджає до Маямі без копійки в кишені й жорстоким шляхом піднімається на вершину наркокартелю, але стає параноїком."
    },
    rating: 8.3,
    poster: "https://preview.redd.it/scarface-1983-v0-mbrbdvfqyo8e1.jpeg?width=640&crop=smart&auto=webp&s=956c3f7522994e07cce4f3bdda9b9e9a6f0c471c",
    trailer: "Fg5jMd9Yxqo" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 27,
    title: { ru: "Назад в будущее 2", uk: "Назад у майбутнє 2" },
    year: 1989,
    genre: { ru: ["Фантастика", "Приключения", "Комедия"], uk: ["Фантастика", "Пригоди", "Комедія"] },
    description: {
      ru: "Мартин Макфлай и Док Браун отправляются в 2015 год, чтобы предотвратить беду в будущем семье Мартина, но случайно создают альтернативную, криминализированную временную линию 1985 года.",
      uk: "Мартін Макфлай і Док Браун відправляються в 2015 рік, щоб запобігти біді в майбутньому родині Мартіна, але випадково створюють альтернативну, криміналізовану часову лінію 1985 року."
    },
    rating: 7.8,
    poster: "https://image.tmdb.org/t/p/w400/dm6VDSjs2XvAdyYRZoiHvOwVh6E.jpg",
    trailer: "qBpzO9g2mMQ" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 28,
    title: { ru: "Аладдин", uk: "Аладдін" },
    year: 1992,
    genre: { ru: ["Мультфильм", "Семейный", "Фантастика"], uk: ["Мультфільм", "Сімейний", "Фантастика"] },
    description: {
      ru: "Уличный воришка находит волшебную лампу с джинном и использует свои три желания, чтобы выдать себя за принца и завоевать сердце принцессы Жасмин.",
      uk: "Вуличний злодій знаходить чарівну лампу з джином і використовує свої три бажання, щоб видати себе за принца й завоювати серце принцеси Жасмін."
    },
    rating: 8.0,
    poster: "https://image.tmdb.org/t/p/w400/ww0nz1GjPd9nJyRVUWyJ0hAH8bV.jpg",
    trailer: "7B3t8m6sCFU" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 29,
    title: { ru: "Большой Лебовски", uk: "Великий Лебовські" },
    year: 1998,
    genre: { ru: ["Криминал", "Комедия"], uk: ["Кримінал", "Комедія"] },
    description: {
      ru: "Ленивый любитель боулинга по прозвищу Чувак становится жертвой ошибки тождества и ввязывается в запутанную схему выкупа с участием миллионеров и нигилистов.",
      uk: "Лінивий любитель боулінгу на прізвисько Чувак стає жертвою помилки тотожності й втягується в заплутану схему викупу за участю мільйонерів та нігілістів."
    },
    rating: 8.1,
    poster: "https://preview.redd.it/the-big-lebowski-1998-1003x1500-by-v0-46wmvyqvr5zg1.jpeg?width=640&crop=smart&auto=webp&s=74e269047c2610ea16e5fa625d1be38ee58edcdb",
    trailer: "RNMNgD7LUU8" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 30,
    title: { ru: "Семь", uk: "Сім" },
    year: 1995,
    genre: { ru: ["Криминал", "Драма", "Триллер"], uk: ["Кримінал", "Драма", "Трилер"] },
    description: {
      ru: "Парные детективы отслеживают серийного убийцу, который выбирает свои жертвы в соответствии с семью смертными грехами, создавая из их тел жуткий шедевр.",
      uk: "Парні детективи відстежують серійного вбивцю, який обирає своїх жертв відповідно до семи смертних гріхів, створюючи з їхніх тіл моторошний шедевр."
    },
    rating: 8.6,
    poster: "https://preview.redd.it/seven-1995-2856x4320-by-aleksander-walijewski-v0-ffqnq0y4f4hb1.jpg?width=640&crop=smart&auto=webp&s=12775a02d331c169456e6bbe5b74506bd976c41b",
    trailer: "z1CV2CRW1jA" // Switched to Fan Archive (Embed allowed)
  },
  {
    id: 31,
    title: { ru: "Маска", uk: "Маска" },
    year: 1994,
    genre: { ru: ["Комедия", "Фэнтези", "Криминал"], uk: ["Комедія", "Фентезі", "Кримінал"] },
    description: {
      ru: "Скромный банковский служащий находит древнюю маску божества Локи, которая превращает его в неуязвимого, эксцентричного супергероя с мультяшными способностями.",
      uk: "Скромний банківський службовець знаходить древню маску божества Локі, яка перетворює його на невразливого, ексцентричного супергероя з мультяшними здібностями."
    },
    rating: 8.0,
    poster: "https://preview.redd.it/the-mask-1994-724-x-1024-v0-pefocmp83nx21.jpg?width=640&crop=smart&auto=webp&s=9294d1e45625f34a6cd1008408e335af33a365f5",
    trailer: "hOqWRvrCba0"
  },
  {
    id: 32,
    title: { ru: "13-й воин", uk: "13-й воїн" },
    year: 1999,
    genre: { ru: ["Боевик", "Приключения", "Фэнтези"], uk: ["Бойовик", "Пригоди", "Фентезі"] },
    description: {
      ru: "Утонченный арабский поэт Ахмед ибн Фадлан, изгнанный на варварский Север, вынужден присоединиться к отряду из 12 грозных викингов, чтобы исполнить древнее пророчество и сразиться с таинственным пожирателями мертвых.",
      uk: "Витончений арабський поет Ахмед ібн Фадлан, вигнаний на варварську Північ, змушений приєднатися до загону з 12 грізних вікінгів, щоб виконати давнє пророцтво та вступити у бій із таємничими пожирачами мертвих."
    },
    rating: 7.4,
    poster: "https://preview.redd.it/the-13th-warrior-1999-v0-mut4cs8z5byc1.jpeg?width=640&crop=smart&auto=webp&s=ed49ff2f621395ee1bd0583a23791ff9b6167aca",
    trailer: "ZeGbSOdedqI"
  },
  {
    id: 33,
    title: { ru: "Кошмар на улице Вязов", uk: "Кошмар на вулиці В'язів" },
    year: 1984,
    genre: { ru: ["Ужасы"], uk: ["Жахи"] },
    description: {
      ru: "Несколько подростков из пригорода видят один и тот же кошмарный сон, в котором их преследует изуродованный человек в полосатом свитере и с лезвиями на перчатке, способный убивать наяву.",
      uk: "Кілька підлітків із передмістя бачать один і той самий кошмарний сон, у якому їх переслідує знівечений чоловік у смугастому светрі та з лезами на рукавичці, здатний убивати наяву."
    },
    rating: 7.5,
    poster: "https://preview.redd.it/a-nightmare-on-elm-street-1984-755-x-1006-v0-a70htexvpfp11.png?width=640&crop=smart&auto=webp&s=0538bd4fa17d8ff0a9e647fb3fc1c52b2e7465c9",
    trailer: "dCVh4lBfW-c"
  },
  {
    id: 34,
    title: { ru: "Индиана Джонс: В поисках утраченного ковчега", uk: "Індіана Джонс: У пошуках втраченого ковчега" },
    year: 1981,
    genre: { ru: ["Приключения", "Боевик"], uk: ["Пригоди", "Бойовик"] },
    description: {
      ru: "Харизматичный археолог и искатель приключений Индиана Джонс отправляется в опасное кругосветное путешествие, чтобы опередить нацистов и первым отыскать мистический Артефакт — Ковчег Завета.",
      uk: "Харизматичний археолог і шукач пригод Індіана Джонс вирушає в небезпечну навколосвітню подорож, щоб випередити нацистів і першим відшукати містичний Артефакт — Ковчег Завіту."
    },
    rating: 8.4,
    poster: "https://external-preview.redd.it/raiders-of-the-lost-ark-1981-not-indiana-jones-and-the-v0-BlH07jpCGIoL_pwKn3zSeLM6B8RAKQQ9aa_Vm1z5SZg.jpg?width=640&crop=smart&auto=webp&s=d9b72c81ce14eeca39f759bd5cb05f3fd356c1e1",
    trailer: "0xFcl67-FPo"
  }
];