import { ApiParams, mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";
import Config from "./config";
import { Response } from "express";

/**
 * Fetch pages inside categories
 */
const fetchArticles = async (response: Response) => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRowDatas = await loadSheetRows(Config.fetchArticles.sheetName);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;

        console.log(allRowData?.csvRow);
        response && response.write(allRowData?.csvRow?.name)

        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const params: ApiParams = {
            list: "categorymembers",
            cmtitle: "Ангилал:" + row["name"],
        };

        const content = await bot.query(params);

        const within = content.query?.categorymembers
            ?.map(
                (val: { pageid: number; ns: number; title: string }) =>
                    val.title
            )
            .join("\n");

        row["articles"] = within;
        row["skip"] = "D";

        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

export default fetchArticles;