import * as dotenv from "dotenv";
import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { connectArticles } from "../../utils/wikidataUtils";
import { readFromCsv } from "../../utils/csv";

dotenv.config();

const wikidatabot = new mwn(WikidataBotConfig());
wikidatabot.login(); // suss

const FILE = "./src/projects/createcats/data.csv";

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

    // await bot.create(`Ангилал:${name}`!, content!, summary);
    await new Promise((r) => setTimeout(r, 3000));
    if (page.interwiki) {
      await connectArticles(
        wikidatabot,
        "mn",
        `Category:${name}`!,
        page.interwiki?.split(":")[0],
        `Category:${page.interwiki.split(":")[1]}`
      );
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

createCatArticles();
