import { mwn } from "mwn";
import { BotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheetRows } from "../utils/goog";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const SHEETNAME = "Stubs";

    const allRowDatas = await loadSheetRows(SHEETNAME);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        if (!row) {
            console.log("Unknown error");
            continue;
        }
        const name = row['name']
        console.log(name)

        const image = row['icon'].replace("File:", "")
        const typegenitive = row['typegenitive']
        const typesubject2 = row['typesubject2']
        const _type = row['type']
        const alttypelink = row['alttypelink']
        const newcat = row['newcat']

        // const subject = alttypelink || `[[${_type}|${typegenitive}]]`
        const subject2 = `[[${_type}|${typesubject2}]]`
        const category = newcat || _type

        const data = `{{asbox
	| image = ${image}
	| subject2 = ${subject2}
    | category = ${category}
}}<noinclude>[[Ангилал:Загвар:Улс орны тухай гүйцэд бус өгүүллүүд]]</noinclude>`;
        await bot.edit(name, (rev) => {
            return {
                text: data,
                summary: "Загварыг шинэчилж байна",
                minor: true,
            };
        });

        row['skip'] = 'D'
        await row.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }

};

main();
