import { ApiParams, mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import {
  connectMnToEn,
  connectedOrNot,
  getWikidataIdsGeneric,
} from "../../utils/wikidataUtils";
import { simpleReadFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";
import * as fs from "fs";

const checkWikidata = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();
  let listofarticles = [
    "Уильям Тафт",
    "Улоф Палмэ",
    "Ураи-Кёхальми Каталин",
    "Фёдор Фёдорович Ушаков",
    "Фердинанд Вербист",
    "Фердинанд Маркос",
    "Франк Швальба-Хот",
    "Франсуа Кальер",
    "Франсуа Миттеран",
    "Франтишек Гонгор",
    "Франческо Петрарка",
    "Фредерик Бартольди",
    "Фэйянгу",
    "Хавидений Айдос",
    "Хадаан",
    "Хадай",
    "Халима Якоб",
    "Хамид Карзай",
    "Харри Гордон Селфриж",
    "Хельмут Коль",
    "Хенрик Сиенкевич",
    "Хишилиг",
    "Хожин бэхи",
    "Хулиан Альварес",
    "Честер Артур",
    "Чин Хай",
    "Шарль Гуно",
    "Шерил Кара Сэндберг",
    "Шон Уайт",
    "Эдуард Мане",
    "Эдуард Шеварднадзе",
    "Эльжбиета Витек",
    "Эмиль Литтре",
    "Эмир Кустурица",
    "Эүминиз",
    "Юзеф Пилсудски",
    "Юйчужянь шаньюй",
    "Юн Сок Ёл",
    "Ян III Собиески",
    "Ян Юнг-Мо",
  ];

  let data: string[] = [];

  for await (const ar of listofarticles) {
    const result = await connectedOrNot(bot, ar);
    const data = `"${ar}",${result}\n`;
    fs.appendFileSync("./test.txt", data);
  }
};

checkWikidata();
