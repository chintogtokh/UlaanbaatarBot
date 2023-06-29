import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { connectArticles } from "../../utils/wikidataUtils";
import { loadSheetRows } from "../../utils/goog";


const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();
  const wikidatabot = new mwn(WikidataBotConfig());
  await wikidatabot.login();

  const allRows = await loadSheetRows('BotCsvCat')

  for await (const allRow of allRows) {
    const article = allRow.csvRow
    if (!article) {
      console.log("Error: ", allRow)
      continue
    }
    console.log(article.name);

    if (!article.interwiki && !article.content && article.categories.length == 0) {
      console.log(`Skipping ${article.name}`);
    }

    if (article.interwiki) {
      try {
        await connectArticles(
          wikidatabot,
          article.interwiki.lang,
          article.interwiki.name,
          "mn",
          article.name
        );
      } catch (e) {
        console.log("Error, check interwiki");
      }
      await new Promise((r) => setTimeout(r, TIMEOUT + 5000));
    }

    if (article.content.length > 0 || article.categories.length > 0)
      await bot.edit(article.name, (rev) => {
        let text =
          (article.content ? `${article.content}\n` : "") +
          `${rev.content}\n` +
          (article.categories
            ? article.categories.map((v) => `[[Ангилал:${v}]]`).join("\n")
            : "");

        return {
          text,
          summary: "Анги нэмэв",
          minor: true,
        };
      });

    await new Promise((r) => setTimeout(r, TIMEOUT));
  }
};

main();
