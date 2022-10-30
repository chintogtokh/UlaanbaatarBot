import { mwn } from "mwn";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

const searchAndReplace = async () => {
  const bot = new mwn(config);

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
