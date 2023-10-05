import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";
import { connectArticles } from "../../utils/wikidataUtils";
import Config from "./config";

/**
 * Replaces category pages with "Content". Creates if not exists.
 */
const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRows = await loadSheetRows(Config.replaceCats.sheetName);

    for await (const allRow of allRows) {
        const article = allRow.csvRow;

        if (!article) {
            console.log("Error: ", allRow);
            continue;
        }
        console.log(`Ангилал:${article.name}`);

        const newcats = article?.categories
            .flatMap((cat) => cat.split("\n"))
            .filter((cat) => !!cat && cat !== "{NULL}" && cat !== "?")
            .map((cat) =>
                cat.replace("}", "").replace("{", "").replace("\r", "")
            );

        if (!article.interwiki && !article.content && newcats.length == 0) {
            console.log(`Skipping Ангилал:${article.name}`);
        }

        console.log(article.content, newcats);
        let editedArticle = false;

        if (article.content.length > 0 || newcats.length > 0) {
            let text =
                (article.content ? `${article.content}\n` : "") +
                (newcats
                    ? newcats.map((v) => `[[Ангилал:${v}]]`).join("\n")
                    : "");
            try {
                await bot.edit(`Ангилал:${article.name}`, (rev) => {
                    return {
                        text,
                        summary: Config.replaceCats.summary,
                        minor: true,
                    };
                });
                editedArticle = true;
            } catch {
                await bot.create(
                    `Ангилал:${article.name}`!,
                    text,
                    Config.replaceCats.summary
                );
            }
        }

        await new Promise((r) => setTimeout(r, TIMEOUT));

        if (article.interwiki && editedArticle !== true) {
            try {
                await connectArticles(
                    wikidatabot,
                    article.interwiki.lang,
                    article.interwiki.name,
                    "mn",
                    `Ангилал:${article.name}`
                );
            } catch (e) {
                console.log("Error, check interwiki");
            }
        }

        const googRow = allRow?.goog;
        if (googRow) {
            googRow["skip"] = "#";
            await googRow.save();
        }

        console.log(`Done Ангилал:${article.name}`);

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
