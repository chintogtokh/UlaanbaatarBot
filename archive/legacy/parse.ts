import { mwn } from "mwn";
import { BotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";




/**
 * Reads the article and adds the content into Google Sheets
 */
const main = async () => {
    // const bot = new mwn(BotConfig);
    // await bot.login();
    const SHEETNAME = "Stubs";

    const allRowDatas = await loadSheetRows(SHEETNAME);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        // const rawData = await bot.read(row["name"]);
        // const intro = rawData?.revisions?.[0]?.content;

        const content = row["type"] as string

        const mat = content.matchAll(/\[\[([^\]\[\|]*)[^\]\[]*\]\]/g);

        console.log(content, Array.from(mat, match => match[1]))

        // row["typenew"] = mat;
        // await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
