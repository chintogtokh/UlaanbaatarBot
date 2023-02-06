import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig } from "../utils/bot";

const FILE = "/Users/chintogtokh/dev/UlaanbaatarBot/src/uncategorised/1.csv";

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const parseCSV = () => {
    const articles: string[] = [];
    const arr = fs.readFileSync(FILE).toString().split("\n");
    articles.push(...arr.slice(1));
    return articles;
  };

  const articles = parseCSV();

  for await (const article of articles) {
    const splitted = article.replace("\r", "").split(",");
    const name = splitted[0];
    const processOrNot = splitted[1] === "0";
    if (!processOrNot) continue;
    const categoryNames = splitted.slice(4).filter((v) => v);
    console.log(name, categoryNames);
    await bot.edit(name, (rev) => {
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
