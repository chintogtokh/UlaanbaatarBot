import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";
import { connectArticles } from "../../utils/wikidataUtils";
import Config from "./config";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const rows = await loadSheetRows(Config.createCats.sheetName);

    /**
     * name - interwiki - contents - category1..13
     */
    for await (const row of rows) {
        const csvRow = row.csvRow;

        const newcats = csvRow?.categories
            .flatMap((cat) => cat.split("\n"))
            .filter((cat) => !!cat)
            .map((cat) => cat.replace("\r", ""));

        const content = [
            csvRow?.content,
            ...(newcats || []).map(
                (catName: string) => `[[Ангилал:${catName}]]`
            ),
        ].join("\n");

        console.log(row.csvRow?.name);
        console.log(content);

        console.log(`Ангилал:${row.csvRow?.name}`!, content!);

        await bot.create(
            `Ангилал:${row.csvRow?.name}`!,
            content!,
            Config.createCats.summary
        );

        if (csvRow?.interwiki) {
            await connectArticles(
                wikidatabot,
                "mn",
                `Category:${row.csvRow?.name}`!,
                csvRow?.interwiki.lang,
                `Category:${csvRow?.interwiki.name}`
            );
        }

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();