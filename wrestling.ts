import { mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

const iin = (val: string) => {
  const matcher = val.match(/[аиоөуүэ]/);
  if (!matcher?.[0]) {
    return false;
  }
  if ("аоу".includes(matcher[0])) {
    return "эр";
  }
  return "эм";
};

const wrestling = async () => {
  const bot = new mwn(config);

  console.log(config);

  await bot.login();

  const articles = [
    // "Амирдын Санжид",
    // "Бадраагийн Бадар-Ууган",
    // "Барнасангийн Пүрэвсүрэн",
    // "Батмөнхийн Батцэцэг",
    // "Баттулгын Ганхуяг",
    // "Бизъяагийн Даваа",
    // "Болдбаатарын Буянбат",
    // "Болдбаатарын Бямбадорж",
    // "Болдбаатарын Доржсүрэн",
    // "Болдбаатарын Одсүрэн",
    // "Болдпүрэвийн Өнөржаргал",
    // "Болдын Дамба",
    // "Болдын Түвшинтулга",
    // "Болормаагийн Хүдэрчулуун",
    // "Боолоогийн Баатар",
    // "Борын Мөнхбат",
    // "Будаагийн Батсайхан",
    // "Бумуудэнгийн Олзод",
    // "Буучийн Жигмэддорж",
    // "Буян-Өлзийн Амар-Амгалан",
    // "Буянтогтохын Ганзориг",
    // "Буянтогтохын Пүрэвдорж",
    // "Буянхишигийн Алтанхуяг",
    // "Бэгзийн Ганбаатар",
    // "Бэгзийн Гончигсүрэн",
    // "Бэгзийн Лхагва-Очир",
    // "Бямбаагийн Батбаяр",
    // "Бямбаагийн Нямбаяр",
    // "Бямбадоржийн Батдорж",
    // "Бямбасүрэнгийн Баатарсүрэн",
    "Бүрнээгийн Баянмөнх",
    "Бүүвэйбаатарын Анхтөр",
    "Бөхбатын Анандпүрэв",
    "Ваанийн Намсрай",
    "Гаадансүрэнгийн Батбилэг",
    "Гаанжуурын Батням",
    "Галбадрахын Гантулга",
    "Ганбаатарын Бүрэнбаяр",
    "Ганбаатарын Түмэнжаргал",
    "Ганбаатарын Энх-Эрдэнэ",
    "Ганбаатарын Эрдэнэбаяр",
    "Ганбаатарын Эрхэмбаяр",
    "Ганбатын Нямандэлэг",
    "Ганболдын Аззаяа",
    "Ганболдын Анхбаяр",
    "Ганболдын Ариунболд",
    "Ганболдын Болдгэрэл",
    "Ганболдын Ганзориг",
    "Ганболдын Ганням",
    "Ганболдын Нямцогт",
    "Ганболдын Төрболд",
    "Ганболдын Төрмөнх",
    "Ганболдын Ширчинбат",
    "Ганпүрэвийн Ганбаатар",
    "Гансүхийн Хишигбат",
    "Гомбодоржийн Цэнддорж",
    "Гомбын Сэр-Од",
    "Готовын Аким",
    "Готовын Эрдэнэбилэг",
    "Гунгаагийн Баясгалан",
    "Гэндэнгийн Нямдоо",
    "Гэсэржавын Пүрэвдорж",
    "Даваадагвын Дарханбаатар",
    "Даваадоржийн Батчулуун",
    "Даваадоржийн Болдбаатар",
    "Даваадоржийн Мягмардорж",
    "Даваадоржийн Төрболд",
    "Даваадоржийн Ууганбаяр",
    "Даваадоржийн Эрдэнэтулга",
    "Даваажавын Энхбаяр",
    "Даваажанцангийн Батбаяр",
    "Даваанямын Хишигдаваа",
    "Даваасүрэнгийн Аззаяа",
    "Даваасүрэнгийн Батбаяр",
    "Даваасүрэнгийн Бямбацогт",
    "Даваасүрэнгийн Гансүх",
    "Даваасүрэнгийн Золбаяр",
    "Даваахүүгийн Цэвэлсодном",
    "Дагвасамбуугийн Бямбасүрэн",
    "Дагвын Эрдэнэбилэг",
    // "Далхсүрэнгийн Одсүрэн",
    // "Дамдинсүрэнгийн Ариунбаатар",
    // "Дамдинсүрэнгийн Батболд",
    // "Дамдинсүрэнгийн Баянжаргал",
    // "Дамдинсүрэнгийн Пүрэвдорж",
    // "Дамирангийн Баатаржав",
    // "Дандардоржийн Өлзий",
    // "Данзанваанчигын Ухнаа",
    // "Данзангийн Түвшинтөгс",
    // "Дарамын Ёндон",
    // "Дарханбаатарын Уртнаст",
    // "Даш-Очирын Батсүмбэр",
    // "Дашдаваагийн Чулуундорж",
    // "Дашдамбын Цэрэндорж",
    // "Дашдоржийн Наранбаатар",
    // "Дашдоржийн Наранжаргал",
    // "Дашзэвэгийн Ганхуяг",
    // "Дашзэвэгийн Ишдулам",
    // "Дашийн Адилбиш",
    // "Дашлхүмбийн Галбаатар",
    // "Дашнямын Батням",
    // "Дашнямын Ганцоож",
    // "Дашнямын Мөнхболд",
    // "Дашцэрэнгийн Самданжамц",
    // "Довдонгийн Гантөмөр",
    // "Долгорын Норовцэрэн",
    // "Дондогийн Бямбаа",
    // "Доржготовын Батбаатар",
    // "Доржийн Ням-Очир",
    // "Доржийн Хүрэлбаатар",
    // "Доржпүрэвийн Энхтайван",
    // "Доржсүрэнгийн Батсүх",
    // "Дэмбэрэлийн Данаа",
    // "Дэмчигийн Галдан",
    // "Дэндэвийн Бадарч",
    // "Дэнсмаагийн Дүнгэрдорж",
    // "Дэрмээгийн Уламбаяр",
    // "Дүгдэлийн Мягмаржав",
    // "Дүдлийнамжилын Баттөмөр",
    // "Дөрвөлжингийн Оюунцэцэг",
    // "Жаалаагийн Наранбаатар",
    // "Жавзандуламын Хатанзоригт",
    // "Жавхлангийн Мандахбаяр",
    // "Жадавын Дашпүрэв",
    // "Жадамбаагийн Чагнаа",
    // "Жалаагийн Баясгалан",
    // "Жалан-Аажавын Тэгшзаяа",
    // "Жамбалын Шийрэвмөнх",
    // "Жамбын Гомбожав",
    // "Жамсрангийн Бямбадорж",
    // "Жамсрангийн Урангуа",
    // "Жамцын Лувсанбалдан",
    // "Жанчивдоржийн Жамьяансүрэн",
    // "Жанчивын Намсрай",
    // "Жаргалын Энхбаатар",
    // "Жигжидийн Ганзолбоо",
    // "Жигжидсүрэнгийн Бадрал",
    // "Жигжидсүрэнгийн Бямбадонид",
    // "Жингээгийн Жономаа",
    // "Загдсүрэнгийн Наранбаатар",
    // "Зандаръяагийн Жиймэн",
    // "Ичинхорлоогийн Жүгдэрнамжил",
    // "Ишжанцангийн Батсайхан",
    // "Лувсангийн Оюунчимэг",
    // "Лувсангийн Рагчаа",
    // "Лувсандоржийн Баярт",
    // "Лувсандоржийн Тойв",
    // "Лувсандоржийн Төртогтох",
    // "Лувсансодовын Чимэд-Очир",
    // "Лувсанчойдорын Сэргэлэн",
    // "Лхагвадоржийн Ариунаа",
    // "Лхагвадоржийн Даваажамц",
    // "Лхагвасүрэнгийн Алтанхуяг",
    // "Лхагвасүрэнгийн Цолмонбаатар",
    // "Лхагвасүрэнгийн Энхбат",
    // "Лхагвын Баяр",
    // "Лхамжавын Буянжаргал",
    // "Лхамсүрэнгийн Жамсран",
    // "Лхамхүүгийн Дарьзав",
    // "Лханаагийн Алтангэрэл",
    // "Лханаагийн Нямбаяр",
    // "Лхангаажавын Цээсүрэн",
    // "Лхасүрэнгийн Мөнхбаяр",
    // "Лүжээгийн Жамсран",
    // "Маамуугийн Отгонням",
    // "Маамуугийн Төмөртогоо",
    // "Магсаржавын Майнбаяр",
    // "Майбаатарын Баярмандах",
    // "Майбаатарын Жаргалсайхан",
    // "Майдарын Дашренчин",
    // "Малышийн Эркебулан",
    // "Маналжавын Тогмид",
    // "Мандаахүүгийн Батсайхан",
    // "Мандширын Янжиндулам",
    // "Машбатын Ивээл",
    // "Мягмардоржийн Бямбазоригт",
    // "Мягмарсүрэнгийн Мэндсайхан",
    // "Мягмарын Батзориг",
    // "Мягмарын Тэгшбаяр",
    // "Мөнхбадрахын Мөнгөнцэцэг",
    // "Мөнхжаргалын Батбаатар",
    // "Мөнхжаргалын Бямбадорж",
    // "Мөнхжаргалын Улаанхүү",
    // "Мөнхцэнгэлийн Амарсанаа",
    // "Найдангийн Нямбуу",
    // "Наранцэцэгийн Энхжаргал",
    // "Нармандахын Наранпүрэв",
    // "Насангийн Хүрээт",
    // "Нацагдоржийн Чимэддорж",
    // "Нацагийн Гансүх",
    // "Нэргүйбаярын Эрдэнэчулуун",
    // "Ням-Осорын Наранбаяр",
    // "Ням-Очирын Даваахүрэл",
    // "Нямбуугийн Ишжамц",
    // "Нямдоржийн Өсөхбаяр",
    // "Нямжавын Ширчинхүү",
    // "Нямпүрэвийн Батсайхан",
    // "Нямсүрэнгийн Анхбаяр",
    // "Нямсүрэнгийн Мөнх-Ирээдүй",
    // "Нямсүрэнгийн Пүрэвсүрэн",
    // "Нямсүрэнгийн Шинэзоригт",
    // "Нямын Батчулуун",
    // "Нөмрөгийн ДЦГ",
    // "Одсүрэнгийн Баярхүү",
    // "Оргодолын Өлзиймөнх",
    // "Осгондаваагийн Эрдэнэбат",
    // "Осорын Эрдэнэбаатар",
    // "Отгонбаярын Энэрэл",
    // "Очгэрэлийн Батцэнгэл",
    // "Очирхүүгийн Мөнхтөр",
    // "Очирын Номт",
    // "Очирын Пүрэв",
    // "Оюунбаатарын Мөнх-Ирээдүй",
    // "Оюунбатын Батжаргал",
    // "Оюунгэрэлийн Наранбаатар",
    // "Оюунцэцэгийн Бат-Эрдэнэ",
    // "Паавангийн Дамдин",
    // "Пагамын Нармандах",
    // "Пагважавын Баярсайхан",
    // "Потсдамын Тунхаг",
    // "Пунцагбалжирын Энхмөнх",
    // "Пунцагнамжилын Балдандорж",
    // "Пэрэнлэйжамцын Баярхүү",
    // "Пүрэвдашийн Мөнхтогт",
    // "Пүрэвдоржийн Баасанбямба",
    // "Пүрэвдоржийн Батсүх",
    // "Пүрэвдоржийн Эрхэмжаргал",
    // "Пүрэвжавын Ганхуяг",
    // "Пүрэвжавын Мөнхбат",
    // "Пүрэвийн Гантөгс",
    // "Пүрэвийн Дамбадаржаа",
    // "Пүрэврагчаагийн Жаргалсайхан",
    // "Пүрэвсүрэнгийн Батхуяг",
    // "Пүрэвээгийн Өсөхбаатар",
    // "Раднаагийн Батаа",
    // "Рэгдэлийн Анхбаатар",
    // "Рэнцэндамбын Сэддорж",
    // "Рэнцэнсамбуугийн Батсүх",
    // "Сайжийбамбуугийн Золбаяр",
    // "Сайнбилэгийн Бат-Үүл",
    // "Самбадондогийн Цэрэндорж",
    // "Самбуугийн Энхбулаг",
    // "Самдангийн Тараа",
    // "Сандаг-Очирын Юнрэн",
    // "Сандагийн Баянмөнх",
    // "Сандангийн Жавзмаа",
    // "Сандуйжавын Дамдин",
    // "Сандуйжавын Эрдэнэсайхан",
    // "Сандярын Адъяа",
    // "Санийдагвын Түвшинжаргал",
    // "Содномбалжирын Бүдрагчаа",
    // "Сономын Аварзэд",
    // "Сономын Лочин",
    // "Соронзонболдын Батболд",
    // "Сосорбурамын Пүрэвчулуун",
    // "Сувателын Жиенхан",
    // "Сумъяагийн Баярт-Од",
    // "Сэргэлэнгийн Чулуунхүү",
    // "Сэрээнэнгийн Гиваапил",
    // "Сүнрэвийн Ганбямба",
    // "Сүхбаатарын Мөнхсүх",
    // "Сүхбатын Оргилбаатар",
    // "Сүхийн Дамбий",
    // "Темирбекийн Жархын",
    // "Тогмидын Доржханд",
    // "Тогоогийн Батсайхан",
    // "Тогоогийн Идэрдорж",
    // "Тогтоолын Мягмарсүрэн",
    // "Тогтохбаярын Баасанжав",
    // "Тогтохын Уртнасан",
    // "Тоймын Жамц",
    // "Тугалхүүгийн Баасансүрэн",
    // "Тэрбишийн Аваадорж",
    // "Түвдэндоржийн Аззаяа",
    // "Түлекийн Ерболат",
    // "Түмэн-Өлзийн Баярмагнай",
    // "Түмэнбаярын Буянжаргал",
    // "Төмөрбаатарын Ганбаатар",
    // "Төмөрийн Арслан",
    // "Төмөрийн Гүрсоронзон",
    // "Төмөрийн Дүүрэнсаран",
    // "Төмөртогоогийн Түвшинтулга",
    // "Төрбатын Ядамсүрэн",
    // "Төрмөнхийн Хайдав",
    // "Төрөөгийн Мягмаржав",
    // "Улаанхүүгийн Мөнхчулуун",
    // "Усникагийн Батгэрэл",
    // "Фрунзегийн Мөнхсүх",
    // "Хайдавын Сэргэлэн",
    // "Халтарын Бөхбаяр",
    // "Хандын Лувсанбазар",
    // "Хархүүгийн Мандахбаяр",
    // "Хасын Шаравжамц",
    // "Хаш-Эрдэнийн Төмөрбаатар",
    // "Хожгорын Лхагвасүрэн",
    // "Хэвэлхүүгийн Энхчулуун",
    // "Цагаанхүүгийн Энхбат",
    // "Цогдоржийн Бавуудорж",
    // "Цогтын Бямбаа",
    // "Цогтын Лантуу",
    // "Цоодолын Үржинбаатар",
    // "Цулын Энхтамир",
    // "Цэвээнрэгзэнгийн Чинзориг",
    // "Цэгмидийн Сүхбаатар",
    // "Цэдэн-Ишийн Баярбат",
    // "Цэдэнбалын Зориг",
    // "Цэдэндамбын Готов",
    // "Цэдэндоржийн Төгсжаргал",
    // "Цэнд-Аюушийн Батжаргал",
    // "Цэнд-Аюушийн Цогт-Эрдэнэ",
    // "Цэндийн Цэнд-Аюуш",
    // "Цэрэгбаатарын Эрхэмбаяр",
    // "Цэрэндолгорын Жамсран",
    // "Цэрэндолгорын Нарангэрэл",
    // "Цэрэндондогийн Адьяа",
    // "Цэрэндоржийн Агваан",
    // "Цэрэндоржийн Баясгалан",
    // "Цэрэндоржийн Ганбат",
    // "Цэрэнноровын Анхбаяр",
    // "Цэрэнхандын Мөнхзориг",
    // "Цэцэндэлгэрийн Цэдэндамба",
    // "Чалхаагийн Маналсүрэн",
    // "Чогсомын Батхуяг",
    // "Чойдоржийн Бүрэнзэвсэг",
    // "Чойдоржийн Энхзаяа",
    // "Чойжилсүрэнгийн Мөнхтогтох",
    // "Чойжоогийн Дагвадорж",
    // "Чойжоохорлоогийн Чойжилсүрэн",
    // "Чоймболын Долгор",
    // "Чуваамэдийн Энхбат",
    // "Чулуундаваагийн Мөнхбаяр",
    // "Чулуунтөмөрийн Энхмөнх",
    // "Чүлтэмийн Улаан",
    // "Шагдаржавын Батзориг",
    // "Шагдаржавын Эрдэнэбат",
    // "Шараагийн Мөнх-Од",
    // "Шаравдоржийн Ариунбаатар",
    // "Шаравдоржийн Бямбатогтох",
    // "Шаравдоржийн Отгонтөгс",
    // "Шаравдоржийн Түвдэнбалжир",
    // "Шаравжамцын Энхийн-Од",
    // "Шархүүгийн Наранбаяр",
    // "Шарын Жадамбаа",
    // "Ширнэндоржийн Алтангэрэл",
    // "Элбэгзаяагийн Золбоот",
    // "Энх-Амгалангийн Ариунбуян",
    // "Энхбаатарын Ганбаатар",
    // "Энхбаатарын Төгөлдөр",
    // "Энхбатын Амартүвшин",
    // "Энхбатын Тулга",
    // "Энхбаярын Батжаргал",
    // "Энхбаярын Цолмон",
    // "Энхболдын Эрдэнэбаяр",
    // "Энхжаргалын Дарханбат",
    // "Энхжаргалын Мөнхзоригт",
    // "Энхтөрийн Баасанжав",
    // "Эрдэнэ-Очирын Түмэн-Өлзий",
    // "Эрдэнэбаярын Түмэн-Өлзий",
    // "Эрдэнэхүүгийн Мөнхжаргал",
    // "Эрдэнэцогтын Амгаланбаатар",
    // "Эрдэнэцогтын Одбаяр",
    // "Юнэрэнгийн Баттогтох",
    // "Ядамсүрэнгийн Алтантулга",
    // "Ядамсүрэнгийн Бумбаяр",
    // "Ядамсүрэнгийн Цэдэнбал",
    // "Ядамсүрэнгийн Эрдэнэтулга",
    // "Ядмаагийн Батболд",
    // "Янжинлхамын Мөнхтөр",
  ];

  for await (const article of articles) {
    console.log(`Parsing ${article}: \n`);
    const res = await bot.read(article);
    const text = res?.revisions?.[0]?.content;
    if (text) {
      const wikitext = new bot.wikitext(text);
      if (text?.indexOf("цолтой бөх") > -1) {
        wikitext.parseLinks();
        const links = wikitext.links.map((value) => value.target.title);
        console.log(links);
        const tsolRegex = new RegExp(
          " ([ФЦУЖЭНГШҮЗКПДЛОРХАӨБЫЙЯЧЁСМИТЬВЮЩЕфцужэнгшүзкъещпдлорхаөбыйячёсмитьвю]+ [ФЦУЖЭНГШҮЗКПДЛОРХАӨБЫЙЯЧЁСМИТЬВЮЩЕфцужэнгшүзкъещпдлорхаөбыйячёсмитьвю]+) цолтой бөх"
        );
        const aimag = links.filter(
          (value) => value.indexOf("_аймаг") > -1
        )?.[0];
        const sum = links.filter(
          (value) => value.indexOf("_сум") > -1 || value.indexOf("_(хот)") > -1
        )?.[0];
        const hotuu = links.filter(
          (value) => value.indexOf("_(хот)") > -1
        )?.[0];
        const tsol = text.match(tsolRegex);
        if (aimag && sum && tsol?.[1]) {
          console.log(article, aimag, sum, tsol[1]);
          const potentialcats: string[] = [];
          potentialcats.push(
            tsol[1].charAt(0).toUpperCase() + tsol[1].slice(1)
          );
          let sumname = "";
          if (sum.indexOf("(") > -1) {
            // disambigged sum
            sumname = sum.split("_")[0];
            const disambig = hotuu
              ? aimag.replace("_аймаг", "")
              : sum.match(/\((.+)\)/)?.[1];
            // if (iin(sumname) === "эр") {
            potentialcats.push(sumname + "ын (" + disambig + ") хүн");
            potentialcats.push(sumname + "ы (" + disambig + ") хүн");
            potentialcats.push(sumname + "гийн хүн");
            potentialcats.push(sumname + "н хүн");
            // }
            // if (iin(sumname) === "эм") {
            // potentialcats.push(sumname + "гийн хүн");
            potentialcats.push(sumname + "ийн (" + disambig + ") хүн");
            potentialcats.push(sumname + "ий (" + disambig + ") хүн");
            potentialcats.push(sumname + "й (" + disambig + ") хүн");
            // }
          } else {
            sumname = sum.replace("_сум", "");
            // if (iin(sumname) === "эр") {
            potentialcats.push(sumname + "ын хүн");
            potentialcats.push(sumname + "ы хүн");
            // potentialcats.push(sumname + "гийн хүн");
            potentialcats.push(sumname + "н хүн");
            // }
            // if (iin(sumname) === "эм") {
            potentialcats.push(sumname + "гийн хүн");
            potentialcats.push(sumname + "ийн хүн");
            potentialcats.push(sumname + "ий хүн");
            potentialcats.push(sumname + "й хүн");
            // }
          }

          for (let index = 0; index < potentialcats.length; index++) {
            console.log(`${index}: ${potentialcats[index]}\n`);
          }

          let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          const answer: string = await new Promise((resolve) => {
            rl.question("Categories to choose? ", resolve);
          });
          const options = answer.split(",").map((v) => parseInt(v, 10));
          const cats = potentialcats.filter((v, i) => options.includes(i));
          console.log(cats);

          bot.edit(article, (rev) => {
            let text =
              rev.content +
              "\n" +
              cats.map((v) => `[[Ангилал:${v}]]`).join("\n");
            console.log(text);
            return {
              text: text,
              summary: "Анги нэмэв",
              minor: true,
            };
          });

          rl.close();
        }
        console.log("\n");
      }
    }

    await new Promise((r) => setTimeout(r, 2000));
  }
};

wrestling();
