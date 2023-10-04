import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";

const SHEETNAME = "Mongolians";

/**
 * Reads the article and adds the content into Google Sheets
 */
const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const allRowDatas = await loadSheetRows(SHEETNAME);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const rawData = await bot.read(row["name"]);
        const intro = rawData?.revisions?.[0]?.content;

        const interwiki = true;
        if (interwiki) {
            row["content"] = " " + intro;
        }
        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
