import { mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";
import Regexes from "../../utils/regexes";
import { BotConfig } from "../../utils/bot";

dotenv.config();

// const iin = (val: string) => {
//   const matcher = val.match(/[аиоөуүэ]/);
//   if (!matcher?.[0]) {
//     return false;
//   }
//   if ("аоу".includes(matcher[0])) {
//     return "эр";
//   }
//   return "эм";
// };

const wrestling = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const articles = [
    "Амирдын Санжид",
    "Бадраагийн Бадар-Ууган",
    "Барнасангийн Пүрэвсүрэн",
    "Батмөнхийн Батцэцэг",
    "Баттулгын Ганхуяг",
    "Бизъяагийн Даваа",
    "Боолоогийн Баатар",
    "Бумуудэнгийн Олзод",
    "Буучийн Жигмэддорж",
    "Бямбаагийн Нямбаяр",
    "Ваанийн Намсрай",
    "Гаанжуурын Батням",
    "Ганбаатарын Эрдэнэбаяр",
    "Ганбаатарын Эрхэмбаяр",
    "Ганболдын Аззаяа",
    "Гомбын Сэр-Од",
    "Готовын Аким",
    "Гунгаагийн Баясгалан",
    "Гэндэнгийн Нямдоо",
    "Гэсэржавын Пүрэвдорж",
    "Даваадоржийн Болдбаатар",
    "Даваахүүгийн Цэвэлсодном",
    "Дамдинсүрэнгийн Баянжаргал",
    "Дамирангийн Баатаржав",
    "Дандардоржийн Өлзий",
    "Данзанваанчигын Ухнаа",
    "Данзангийн Түвшинтөгс",
    "Дарамын Ёндон",
    "Дашдаваагийн Чулуундорж",
    "Дашдоржийн Наранбаатар",
    "Дашдоржийн Наранжаргал",
    "Дашзэвэгийн Ганхуяг",
    "Дашзэвэгийн Ишдулам",
    "Дашийн Адилбиш",
    "Дашлхүмбийн Галбаатар",
    "Дашнямын Мөнхболд",
    "Дашцэрэнгийн Самданжамц",
    "Долгорын Норовцэрэн",
    "Дондогийн Бямбаа",
    "Доржпүрэвийн Энхтайван",
    "Дэмбэрэлийн Данаа",
    "Дэмчигийн Галдан",
    "Дэндэвийн Бадарч",
    "Дэнсмаагийн Дүнгэрдорж",
    "Дүгдэлийн Мягмаржав",
    "Дүдлийнамжилын Баттөмөр",
    "Дөрвөлжингийн Оюунцэцэг",
    "Жадамбаагийн Чагнаа",
    "Жалан-Аажавын Тэгшзаяа",
    "Жамбын Гомбожав",
    "Жамсрангийн Бямбадорж",
    "Жамсрангийн Урангуа",
    "Жамцын Лувсанбалдан",
    "Жанчивдоржийн Жамьяансүрэн",
    "Жанчивын Намсрай",
    "Жингээгийн Жономаа",
    "Зандаръяагийн Жиймэн",
    "Ишжанцангийн Батсайхан",
    "Лувсангийн Оюунчимэг",
    "Лувсангийн Рагчаа",
    "Лувсандоржийн Баярт",
    "Лувсандоржийн Тойв",
    "Лувсансодовын Чимэд-Очир",
    "Лувсанчойдорын Сэргэлэн",
    "Лхагвадоржийн Ариунаа",
    "Лхамсүрэнгийн Жамсран",
    "Лхамхүүгийн Дарьзав",
    "Лхангаажавын Цээсүрэн",
    "Лүжээгийн Жамсран",
    "Маамуугийн Төмөртогоо",
    "Магсаржавын Майнбаяр",
    "Майдарын Дашренчин",
    "Маналжавын Тогмид",
    "Мандаахүүгийн Батсайхан",
    "Мандширын Янжиндулам",
    "Машбатын Ивээл",
    "Мягмарсүрэнгийн Мэндсайхан",
    "Мөнхбадрахын Мөнгөнцэцэг",
    "Насангийн Хүрээт",
    "Нацагийн Гансүх",
    "Нямбуугийн Ишжамц",
    "Нямсүрэнгийн Мөнх-Ирээдүй",
    "Нямын Батчулуун",
    "Нөмрөгийн ДЦГ",
    "Оргодолын Өлзиймөнх",
    "Осорын Эрдэнэбаатар",
    "Отгонбаярын Энэрэл",
    "Очирын Номт",
    "Очирын Пүрэв",
    "Оюунбатын Батжаргал",
    "Паавангийн Дамдин",
    "Пагамын Нармандах",
    "Потсдамын Тунхаг",
    "Пунцагнамжилын Балдандорж",
    "Пүрэвдашийн Мөнхтогт",
    "Пүрэвийн Дамбадаржаа",
    "Пүрэвээгийн Өсөхбаатар",
    "Раднаагийн Батаа",
    "Самбадондогийн Цэрэндорж",
    "Самбуугийн Энхбулаг",
    "Самдангийн Тараа",
    "Сандаг-Очирын Юнрэн",
    "Сандангийн Жавзмаа",
    "Сандярын Адъяа",
    "Содномбалжирын Бүдрагчаа",
    "Сономын Аварзэд",
    "Сономын Лочин",
    "Соронзонболдын Батболд",
    "Сэрээнэнгийн Гиваапил",
    "Сүнрэвийн Ганбямба",
    "Сүхийн Дамбий",
    "Тогмидын Доржханд",
    "Тогтохын Уртнасан",
    "Тоймын Жамц",
    "Тугалхүүгийн Баасансүрэн",
    "Төмөрийн Арслан",
    "Хайдавын Сэргэлэн",
    "Хандын Лувсанбазар",
    "Хархүүгийн Мандахбаяр",
    "Хасын Шаравжамц",
    "Хожгорын Лхагвасүрэн",
    "Цогдоржийн Бавуудорж",
    "Цогтын Лантуу",
    "Цэгмидийн Сүхбаатар",
    "Цэдэнбалын Зориг",
    "Цэдэндамбын Готов",
    "Цэндийн Цэнд-Аюуш",
    "Цэрэндондогийн Адьяа",
    "Цэрэндоржийн Агваан",
    "Цэрэндоржийн Баясгалан",
    "Чоймболын Долгор",
    "Чуваамэдийн Энхбат",
    "Чүлтэмийн Улаан",
    "Шагдаржавын Эрдэнэбат",
    "Шадавын Цагаандорж",
    "Шаравдоржийн Түвдэнбалжир",
    "Шаравжамцын Энхийн-Од",
    "Энхбатын Амартүвшин",
    "Эрдэнэцогтын Одбаяр",
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
          `([${Regexes.cyrillicAll}]+ [${Regexes.cyrillicAll}]+ [${Regexes.cyrillicAll}]+) цолтой бөх`
        );

        const tsolMatched = text.match(tsolRegex)?.[1];
        console.log(tsolMatched);
        const tsolParsed = tsolMatched?.split(" ");
        const tsol =
          tsolParsed?.[1] == "хурц"
            ? tsolParsed?.[0] + " " + tsolParsed?.[2]
            : tsolParsed?.[1] + " " + tsolParsed?.[2];
        console.log("tsol", tsol);

        const aimag = links.filter(
          (value) => value.indexOf("_аймаг") > -1
        )?.[0];
        const sum = links.filter(
          (value) =>
            value.indexOf("_сум") > -1 ||
            value.indexOf("_(хот)") > -1 ||
            value.indexOf("_хот") > -1
        )?.[0];
        const hotuu = links.filter(
          (value) => value.indexOf("_(хот)") > -1 || value.indexOf("_хот") > -1
        )?.[0];

        if (aimag && sum && tsol) {
          console.log(article, aimag, sum, tsol[1]);
          const potentialcats: string[] = [];
          potentialcats.push(tsol.charAt(0).toUpperCase() + tsol.slice(1));
          let sumname = "";
          if (sum.indexOf("(") > -1) {
            // disambigged sum
            sumname = sum.split("_")[0];
            const disambig = hotuu
              ? aimag.replace("_аймаг", "")
              : sum.match(/\((.+)\)/)?.[1];

            if (
              "эьайи".includes(sumname.slice(-1)) &&
              !["аа", "ээ", "ий"].includes(sumname.slice(-2))
            ) {
              sumname = sumname.slice(0, -1);
            }
            potentialcats.push(sumname + "ын (" + disambig + ") хүн");
            potentialcats.push(sumname + "ы (" + disambig + ") хүн");
            potentialcats.push(sumname + "гийн (" + disambig + ") хүн");
            potentialcats.push(sumname + "н (" + disambig + ") хүн");
            potentialcats.push(sumname + "ийн (" + disambig + ") хүн");
            potentialcats.push(sumname + "ий (" + disambig + ") хүн");
            // potentialcats.push(sumname + "й (" + disambig + ") хүн");
            // }
          } else {
            sumname = sum.replace("_сум", "").replace("_хот", "");

            if (
              "оэьайи".includes(sumname.slice(-1)) &&
              !["оо", "аа", "ээ", "ий"].includes(sumname.slice(-2))
            ) {
              sumname = sumname.slice(0, -1);
            }

            potentialcats.push(sumname + "ын хүн");
            potentialcats.push(sumname + "ы хүн");
            potentialcats.push(sumname + "н хүн");
            potentialcats.push(sumname + "гийн хүн");
            potentialcats.push(sumname + "ийн хүн");
            potentialcats.push(sumname + "ий хүн");
            // potentialcats.push(sumname + "й хүн");
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
