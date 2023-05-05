import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { readFromCsv } from "../../utils/csv";
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
        (article.categories
          ? article.categories.map((v) => `[[Ангилал:${v}]]`).join("\n")
          : "");
      console.log(rev.content);
      return {
        text,
        summary: "Анги нэмэв",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 2000));

    if (article.interwiki) {
      //todo: copy
      const interwikiLang = article.interwiki.split(":")[0];
      const interwikiTitle = article.interwiki.replace(`${interwikiLang}:`, "");

      await connectArticles(
        wikidatabot,
        interwikiLang,
        interwikiTitle,
        "mn",
        article.name
      );
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
};

main();
