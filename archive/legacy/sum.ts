import { mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheet } from "../utils/goog";

const SHEETNAME = "Sum";

/*
Create Sum category where not exists
  a. Edit people category to add Sum
  b. Add category to sum article
*/
const createSumCategory = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();
    const wikidatabot = new mwn(WikidataBotConfig());
    await wikidatabot.login();

    const sheet = await loadSheet(SHEETNAME);
    const rows = await sheet.getRows();

    for await (const element of rows) {
        if (element["skip"] || element["SumCategoryExists"]) {
            console.log("Skipping: ", element["SumArticle"]);
            continue;
        }

        // Create Ангилал:Адаацаг сум = Монгол суурингаар, Ази суурингаар, Дундговь аймаг| ,

        const aimag = element["Aimag"];
        const sumArticle = element["SumArticle"];
        const sumCategory = element["SumCategory"];
        const peopleCategory = element["PeopleCategory"];

        const newcats = [
            "Монгол суурингаар",
            "Ази суурингаар",
            `${aimag} аймаг| `,
        ];

        const content = [
            ...(newcats || []).map(
                (catName: string) => `[[Ангилал:${catName}]]`
            ),
        ].join("\n");

        console.log(`Ангилал:${sumCategory}`!, content!);

        await bot.create(
            `Ангилал:${sumCategory}`!,
            content!,
            "Ангилал үүсгэж байна"
        );

        // Edit Адаацаг сум = Адаацаг сум| ,

        await bot.edit(sumArticle, (rev) => {
            let categorieshere = [sumCategory];
            let text =
                `${rev.content}\n\n` +
                (categorieshere
                    ? categorieshere.map((v) => `[[Ангилал:${v}]]`).join("\n")
                    : "");
            return {
                text,
                summary: "Ангилал нэмэв",
                minor: true,
            };
        });

        // Edit Ангилал:Адаацагийн хүн = Адаацаг сум|Х,

        await bot.edit(`Ангилал:${peopleCategory}`, (rev) => {
            let categorieshere = [sumCategory + "|Х"];
            let text =
                `${rev.content}\n\n` +
                (categorieshere
                    ? categorieshere.map((v) => `[[Ангилал:${v}]]`).join("\n")
                    : "");
            return {
                text,
                summary: "Ангилал нэмэв",
                minor: true,
            };
        });

        element["SumCategoryExists"] = "DONE";
        await element.save();

        await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

createSumCategory();
