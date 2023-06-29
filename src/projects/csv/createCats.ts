import * as dotenv from "dotenv";
import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { connectArticles } from "../../utils/wikidataUtils";
import { readFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";

dotenv.config();

const wikidatabot = new mwn(WikidataBotConfig());
wikidatabot.login(); // suss

const FILE = "./src/projects/csv/data/createCats.csv";

const createCatArticles = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pagesToCreate = readFromCsv(FILE);

  for await (const page of pagesToCreate.slice(1)) {
    const summary = "Анги үүсгэж байна";

    const content = [
      page.content,
      ...page.categories.map((catName: string) => `[[Ангилал:${catName}]]`),
    ].join("\n");

    console.log(page.name);
    console.log(content);

    await bot.create(`Ангилал:${page.name}`!, content!, summary);

    await new Promise((r) => setTimeout(r, TIMEOUT));
    if (page.interwiki) {
      await connectArticles(
        wikidatabot,
        "mn",
        `Category:${name}`!,
        page.interwiki.lang,
        `Category:${page.interwiki.name}`
      );
      await new Promise((r) => setTimeout(r, TIMEOUT));
    }
  }
};

createCatArticles();
