import { mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig, LangBotConfig } from "../utils/bot";

dotenv.config();

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const articles = [
    "Бүх цэргийн наадам",
    "Дорноговь аймгийн наадам - 2009",
    "Налайхын баяр наадам",
    "Орхон аймгийн баяр наадам",
    "Уул тайлгын наадам",
    "Хүрээ цам-Даншиг наадам",
  ];

  const categoryNames = ["Үндэсний бөхийн барилдааны жагсаалт"];

  for await (const article of articles) {
    await bot.edit(article, (rev) => {
      let text =
        rev.content +
        "\n" +
        categoryNames.map((v) => `[[Ангилал:${v}]]`).join("\n");
      console.log(text);
      return {
        text: text,
        summary: "Анги нэмэв",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 2000));
  }
};

main();
