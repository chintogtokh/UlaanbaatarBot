import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig } from "../utils/bot";

const FILE = "/home/chintogtokh/dev/UlaanbaatarBot/src/uncategorised/data.txt";

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const retrieveParseList = () => {
    const articles: string[] = [];
    const arr = fs.readFileSync(FILE).toString().split("\n");
    articles.push(...arr);
    return articles;
  };

  const articles = retrieveParseList();

  const categoryNames = ["Үндэсний бөх"];

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
