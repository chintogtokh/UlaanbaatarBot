import { ApiParams, mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

/**
 * Fetch pages inside categories
 */
const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const allRowDatas = await loadSheetRows(Config.fetchCats.sheetName);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        console.log(allRowData?.csvRow);
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const params: ApiParams = {
            prop: "categories",
            titles: row["name"],
            cllimit: 500
        };

        const content = await bot.query(params);

        console.log(content.query)

        const within = content.query?.pages?.[0].categories
            ?.map(
                (val: { ns: number; title: string }) =>
                    val.title
            )
            .join("\n");

        row["categories1"] = within;
        row["categories2"] = content.query?.pages?.[0].categories?.length;
        row["skip"] = "#";

        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
