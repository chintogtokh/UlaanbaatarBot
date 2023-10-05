import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { renameCategory } from "../../utils/editCat";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const pages = await loadSheetRows(Config.renameCats.sheetName);

    for await (const page of pages) {
        const thePage = page.csvRow;
        if (thePage?.name && thePage?.moveTo) {
            await renameCategory(
                bot,
                thePage?.name,
                thePage?.moveTo,
                thePage?.moveBoolean
            );

            const googRow = page?.goog;
            if (googRow) {
                googRow["skip"] = "#";
                await googRow.save();
            }
        }
    }
};

main();
