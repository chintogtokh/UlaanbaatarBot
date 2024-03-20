import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { connectArticles } from "../utils/wikidataUtils";
import { loadSheetRows } from "../utils/goog";
import Config from "./config";

const csvCat = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRows = await loadSheetRows(Config.csvCat.sheetName);

    for await (const allRow of allRows) {
        const article = allRow.csvRow;
        if (!article) {
            console.log("Error: ", allRow);
            continue;
        }
        console.log(article.name);

        const newcats = article?.categories
            .flatMap((cat) => cat.split("\n"))
            .filter((cat) => !!cat && cat !== "{NULL}" && cat !== "?")
            .map((cat) =>
                cat.replace("}", "").replace("{", "").replace("\r", "")
            );

        if (!article.interwiki && !article.content && newcats.length == 0) {
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

        console.log(article.content, newcats);

        if (article.contentPre || article.contentPost || article.content.length > 0 || newcats.length > 0) {
            await bot.edit(article.name, (rev) => {
                let text =
                    (article.contentPre ? `${article.contentPre}\n` : "") +
                    `${rev.content}\n\n` +
                    (article.content ? `${article.content}\n` : "") +
                    (article.contentPost ? `${article.contentPost}\n` : "") +
                    (newcats
                        ? newcats.map((v) => `[[Ангилал:${v}]]`).join("\n")
                        : "");
                return {
                    text,
                    summary: Config.csvCat.summary,
                    minor: true,
                };
            });
        }

        const googRow = allRow?.goog;
        if (googRow) {
            googRow["skip"] = "D";
            await googRow.save();
        }

        console.log(`Done ${article.name}`);

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

export default csvCat;