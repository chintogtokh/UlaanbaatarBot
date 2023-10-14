import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const pages = await loadSheetRows(Config.renameCats.sheetName);

    for await (const page of pages) {
        const thePage = page.csvRow;
        if (thePage?.name && thePage?.moveTo) {
            try {
                await bot.move(
                    "Загвар:" + thePage?.name,
                    "Загвар:" + thePage?.moveTo,
                    `[[:Загвар:${thePage?.name}]]-ийг [[:Загвар:${thePage?.moveTo}]] руу зөөж байна`
                );
            } catch (e) {
                console.log(e, "skipping: " + thePage?.name, thePage?.moveTo);
            }
        }
        await new Promise((r) => setTimeout(r, 5000));
    };
}

main();
