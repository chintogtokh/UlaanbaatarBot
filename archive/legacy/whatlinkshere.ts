import { ApiParams, mwn } from "mwn";
import { BotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";


const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();


    const SHEETNAME = "Stubs";

    const allRowDatas = await loadSheetRows(SHEETNAME);

    let foundInList: string[] = []

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const params: ApiParams = {
            list: "embeddedin",
            eititle: row["name"],
            eilimit: 500
        };

        const content = await bot.query(params);


        const backlinks = content?.query.embeddedin

        console.log(backlinks)


        const backlinksNoRed = backlinks.filter((v: { redirect: Boolean, title: string }) => v.redirect !== true)

        row['count'] = backlinksNoRed.length
        await row.save()


        await new Promise((r) => setTimeout(r, TIMEOUT));


    }


};

main();
