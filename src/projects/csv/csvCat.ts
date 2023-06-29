import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { readFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";
import { connectArticles, connectMnToEn } from "../../utils/wikidataUtils";

// const FILE = "./src/projects/csvcat/1.csv";
const FILE = "./src/projects/csv/data/csvCat.csv";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const articles = readFromCsv(FILE);

    for await (const article of articles) {
        console.log(article);
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
                console.log(text);

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