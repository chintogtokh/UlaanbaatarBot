import { loadSheet } from "../utils/goog";
import { TIMEOUT } from "../utils/vars";

const insertInterwiki2TranslateCats = async () => {
    const fromSheetName = "InsertInterwiki";
    const toSheetName = "TranslateCats";

    const fromSheet = await loadSheet(fromSheetName);
    const fromRows = await fromSheet.getRows({ limit: 500 });
    const toSheet = await loadSheet(toSheetName);
    const toRows = await toSheet.getRows({ limit: 500 });

    console.log(`Deleting data from ${toSheetName}`);
    for (let index = toRows.length - 1; index >= 0; index--) {
        await toRows[index].delete();
    }
    await loadSheet(toSheetName);

    await new Promise((r) => setTimeout(r, TIMEOUT));

    console.log(`Copying data from ${fromSheetName} to ${toSheetName}`);
    for (let index = 0; index < fromRows.length; index++) {
        const name = fromRows[index]["name"];
        if (fromRows[index]["content"] == "connected") {
            await toSheet.addRow({
                name: name,
            });
        }
    }
    await toSheet.saveUpdatedCells();
};

async function main() {
    await insertInterwiki2TranslateCats();
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
