import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { unlinkPage } from "../../utils/wikidataUtils";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRows = await loadSheetRows(Config.unlinkPages.sheetName);

    for await (const allRow of allRows) {
        const article = allRow.csvRow;
        if (!article) {
            console.log("Error: ", allRow);
            continue;
        }
        console.log(article.name);

        try {
            await unlinkPage(
                wikidatabot,
                "Ангилал:" + article.name.trim(),
                article.content.trim()
            );
        } catch (e) {
            console.log("Error: ", e);
        }
        await new Promise((r) => setTimeout(r, TIMEOUT + 5000));

        const googRow = allRow?.goog;
        if (googRow) {
            googRow["skip"] = "D";
            await googRow.save();
        }

        console.log(`Done ${article.name}`);

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
