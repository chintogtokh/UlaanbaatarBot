import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { deleteCategory } from "../../utils/editCat";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const pages = await loadSheetRows(Config.deleteCats.sheetName);

    for await (const page of pages) {
        const thePage = page.csvRow;
        if (thePage?.name) {
            await deleteCategory(bot, thePage?.name);
        }
        const googRow = page?.goog;
        if (googRow) {
            googRow["skip"] = "#";
            await googRow.save();
        }
    }
};

main();
