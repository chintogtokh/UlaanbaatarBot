import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";
import { getInterwiki } from "../../utils/wikidataUtils";
import { interwikiParse } from "../../utils/csv";

const SHEETNAME = "Mongolians";

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
