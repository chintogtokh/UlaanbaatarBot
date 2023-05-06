import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { readFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";
import { connectArticles, connectMnToEn } from "../../utils/wikidataUtils";

const FILE = "./src/projects/csvcat/1.csv";

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();
  const wikidatabot = new mwn(WikidataBotConfig());
  await wikidatabot.login();

  const articles = readFromCsv(FILE);

  for await (const article of articles) {
    console.log(article);
    await bot.edit(article.name, (rev) => {
      let text =
        rev.content +
        "\n" +
        (article.content ? `${article.content}\n` : "") +
        (article.categories
          ? article.categories.map((v) => `[[Ангилал:${v}]]`).join("\n")
          : "");
      console.log(text);
      return {
        text,
        summary: "Анги нэмэв",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, TIMEOUT));

    if (article.interwiki) {
      await connectArticles(
        wikidatabot,
        article.interwiki.lang,
        article.interwiki.name,
        "mn",
        article.name
      );
      await new Promise((r) => setTimeout(r, TIMEOUT));
    }
  }
};

main();
