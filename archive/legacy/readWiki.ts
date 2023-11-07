import { mwn } from "mwn";
import { BotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";

const SHEETNAME = "Stubs";

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

        // const interwiki = true;
        // if (interwiki) {
        row["content"] = intro;
        // }

        // const content = row['content']
        // const icon = content.split("\n").filter((v: string) => v.indexOf("image"))
        // row['category'] = icon
        // row['category'] = (content.split("\n").filter((v: string) => v.indexOf("image") > -1)[0].split("=")[1].trim())

        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
