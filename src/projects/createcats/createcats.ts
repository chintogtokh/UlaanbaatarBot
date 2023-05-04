import * as dotenv from "dotenv";
import * as fs from "fs";
import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { connectArticles } from "../../utils/wikidataUtils";

dotenv.config();

const wikidatabot = new mwn(WikidataBotConfig());
wikidatabot.login(); // suss

const readFromCsv = () => {
  const FILE = "./src/projects/createcats/data.csv";
  const articles: string[] = [];
  const arr = fs.readFileSync(FILE).toString().split("\n");
  arr.forEach((element) => {
    if (!element.startsWith("#")) articles.push(element);
  });
  return articles;
};

const createCatArticles = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const categoriesToAdd = readFromCsv();

  for await (const category of categoriesToAdd.slice(1)) {
    const summary = "Анги үүсгэж байна";
    const split = category.split(",");
    const name = split[0];
    const interwiki = split[1]; // in the format en:article
    const textcontent = split[2];
    const cats = split.slice(3);

    const content = [
      textcontent,
      ...cats.map((catName: string) => `[[Ангилал:${catName}]]`),
    ].join("\n");

    console.log(name);
    console.log(content);

    await bot.create(`Ангилал:${name}`!, content!, summary);
    await new Promise((r) => setTimeout(r, 3000));
    await connectArticles(
      wikidatabot,
      "mn",
      `Category:${name}`!,
      interwiki.split(":")[0],
      `Category:${interwiki.split(":")[1]}`
    );

    await new Promise((r) => setTimeout(r, 1000));
  }
};

createCatArticles();
