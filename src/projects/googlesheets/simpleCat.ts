import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheet } from "../../utils/goog";

const SHEETNAME = "International";

const main = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const sheet = await loadSheet(SHEETNAME);
    const rows = await sheet.getRows();

    for await (const row of rows) {
        const article = {
            name: row["Name"],
            categories: (row._rawData as string[])
                .slice(1)
                .reduce(
                    (acc: string[], cur: string) => [
                        ...acc,
                        ...cur.split("\n"),
                    ],
                    []
                )
                .map((v) => v.replace("\r", ""))
                .filter((v) => !!v),
            content: undefined,
        };

        if (article.categories.length > 0)
            console.log(article.name, article.categories);
        // await bot.edit(article.name, (rev) => {
        //     let text =
        //         (article.content ? `${article.content}\n` : "") +
        //         `${rev.content}\n` +
        //         (article.categories
        //             ? article.categories.map((v) => `[[Ангилал:${v}]]`).join("\n")
        //             : "");
        //     return {
        //         text,
        //         summary: "Анги нэмэв",
        //         minor: true,
        //     };
        // });

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
