import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";
import Config from "./config";

// Fetches content from inside pages
const fetchData = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRowDatas = await loadSheetRows(Config.fetchData.sheetName);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        console.log(allRowData?.csvRow);
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const rawData = await bot.read(row["name"]);
        const intro = rawData?.revisions?.[0]?.content;

        console.log(rawData)

        row["content"] = intro;
        row["skip"] = "D";

        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

export default fetchData;