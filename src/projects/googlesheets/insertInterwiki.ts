import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";
import { getInterwiki } from "../../utils/wikidataUtils";
import { interwikiParse } from "../../utils/csv";
import Config from "./config";

const insertInterwiki = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRowDatas = await loadSheetRows(Config.insertInterwiki.sheetName);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        console.log(allRowData?.csvRow);
        if (!row) {
            console.log("Unknown error");
            continue;
        }
        const interwiki = await getInterwiki(bot, row["name"]);
        const rowInterwiki = interwikiParse(row["interwiki"]);
        if (interwiki) {
            row["content"] = "connected";
        }
        if (!rowInterwiki && interwiki) {
            row["interwiki"] = interwiki;
        } else if (!rowInterwiki) {
            row["interwiki"] = "X";
        }
        row["skip"] = "D";
        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

export default insertInterwiki;
