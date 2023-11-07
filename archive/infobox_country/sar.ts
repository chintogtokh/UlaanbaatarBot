import { mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig } from "../../src/utils/bot";

dotenv.config();

const searchAndReplace = async () => {
  const bot = new mwn(BotConfig);

  await bot.login();

  const pages = [
    "Монтенегро",
    "Того",
    "Антигуа ба Барбуда",
    "Доминика",
    "Бүгд Найрамдах Доминикан Улс",
    "Сальвадор",
    "Гвиней-Бисау",
    "Жибути",
    "Чад",
    "Кабо-Верде",
    "Төв Африкийн Бүгд Найрамдах Улс",
    "Экваторын Гвиней",
    "Бүгд Найрамдах Босни ба Херцеговина Улс",
    "Бүгд Найрамдах Ардчилсан Йемен Ард Улс",
    "Арабын Нэгдсэн Бүгд Найрамдах Улс",
    "Коморос",
    "Маврики",
    "Өмнөд Судан",
    "Чехословак",
    "Хэрэглэгч:Chinneeb/1",
    "Хэрэглэгч:Chinneeb/template",
  ];

  for await (const element of pages) {
    console.log(element);

    bot.edit(element, (rev) => {
      let text = rev.content.replace(/\{\{BILD-LAGE-IMAGEMAP\|\}\}/g, "");
      return {
        text: text,
        summary: "[[Загвар:BILD-LAGE-IMAGEMAP]] руух холбоосуудыг устгаж байна",
        minor: true,
      };
    });

    console.log(1);

    await new Promise((r) => setTimeout(r, 1500));
  }
};

searchAndReplace();
