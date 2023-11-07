import { mwn } from "mwn";
import { AdminBotConfig } from "../../utils/bot";
import { deleteCategory } from "../../utils/editCat";
import { loadSheetRows } from "../../utils/goog";
import Config from "./config";

const deleteCats = async () => {
    const bot = new mwn(AdminBotConfig);
    await bot.login();

    const pages = await loadSheetRows(Config.deleteCats.sheetName);

    for await (const page of pages) {
        const thePage = page.csvRow;
        if (thePage?.name) {
            await deleteCategory(bot, thePage?.name);
            await bot.delete("Ангилал:" + thePage?.name, "Устгаж байна").catch((e) => console.log(e))
        }
        const googRow = page?.goog;
        if (googRow) {
            googRow["skip"] = "D";
            await googRow.save();
        }
    }
};

export default deleteCats;
