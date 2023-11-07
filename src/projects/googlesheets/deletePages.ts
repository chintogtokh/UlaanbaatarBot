import { mwn } from "mwn";
import { AdminBotConfig } from "../../utils/bot";
import { loadSheetRows } from "../../utils/goog";
import { TIMEOUT } from "../../utils/vars";

const deletePages = async () => {
    const bot = new mwn(AdminBotConfig);
    await bot.login();

    const pages = await loadSheetRows("DeletePages");

    for await (const page of pages) {
        const thePage = page.csvRow;
        if (thePage?.name) {
            await bot.delete(thePage?.name, "Устгаж байна")
        }
        const googRow = page?.goog;
        if (googRow) {
            googRow["skip"] = "D";
            await googRow.save();
        }
        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

export default deletePages;
