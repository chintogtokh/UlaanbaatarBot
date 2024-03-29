import { ApiParams, mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig, LangBotConfig } from "../utils/bot";
import { TIMEOUT } from "../utils/vars";
import { loadSheet } from "../utils/goog";
import Config from "./config";

dotenv.config();

const FOREIGN_LANGUAGES = Config.translateCats.langs;

const getInOtherLanguage = async (
    bot: mwn,
    foreignBot: mwn,
    title: string,
    fromLang: string,
    FOREIGN_LANGUAGE: string
) => {
    const params: ApiParams = {
        prop: "langlinks",
        titles: title,
        lllimit: 500,
    };

    const content =
        fromLang === "mn"
            ? await bot.query(params)
            : await foreignBot.query(params);

    const toLang = fromLang == "mn" ? FOREIGN_LANGUAGE : "mn";
    const langlinks: { lang: string; title: string }[] =
        content.query?.pages[0].langlinks;

    console.log(content.query?.pages)

    return langlinks?.filter((v) => v.lang == toLang)?.[0]?.title || false;
};

const getCategories = async (
    bot: mwn,
    foreignBot: mwn,
    title: string,
    fromLang: string
) => {
    const params: ApiParams = {
        prop: "categories",
        titles: title,
        cllimit: 500,
    };

    const content =
        fromLang == "mn"
            ? await bot.query(params)
            : await foreignBot.query(params);
    const categories: { ns: number; title: string }[] =
        content?.query?.pages?.[0]?.categories;

    const parsed = categories
        .map((v) => v.title)
        .filter((v) => {
            const low = v.toLowerCase();
            if (low.indexOf("wikipedia") > -1) return false;
            if (low.indexOf("wikidata") > -1) return false;
            if (low.indexOf("infobox") > -1) return false;
            if (low.indexOf("webarchive") > -1) return false;
            if (low.indexOf("good articles") > -1) return false;
            if (low.indexOf("category:pages") > -1) return false;
            if (low.indexOf("category:articles") > -1) return false;
            if (low.indexOf("articles ") > -1) return false;
            if (low.indexOf(" articles") > -1) return false;
            if (low.indexOf(" stubs") > -1) return false;
            if (low.indexOf(" mdy ") > -1) return false;
            if (low.indexOf("cleanup") > -1) return false;
            if (low.indexOf(" dmy ") > -1) return false;
            if (low.indexOf(" stubs") > -1) return false;
            if (low.indexOf("cs1") > -1) return false;
            if (low.indexOf("cite web") > -1) return false;
            if (low.indexOf("википедия") > -1) return false;
            return true;
        });
    return parsed;
};

const translateCats = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const googleSheet = await loadSheet(Config.translateCats.sheetName);
    const rows = await googleSheet.getRows();

    for (const FOREIGN_LANGUAGE of FOREIGN_LANGUAGES) {
        const foreignBot = new mwn(LangBotConfig(FOREIGN_LANGUAGE));
        await foreignBot.login();

        for await (const row of rows) {
            if (row["skip"]) {
                console.log(`Skipping ${row["name"]}`);
                continue;
            }

            const article = row["name"];
            console.log(`Parsing ${article}: \n`);
            const foreignName = await getInOtherLanguage(
                bot,
                foreignBot,
                article,
                "mn",
                FOREIGN_LANGUAGE
            );
            if (foreignName) {
                const categories = await getCategories(
                    bot,
                    foreignBot,
                    foreignName,
                    FOREIGN_LANGUAGE
                );
                const potentialCats: string[] = [];
                for await (const cat of categories) {
                    const mnName = await getInOtherLanguage(
                        bot,
                        foreignBot,
                        cat,
                        FOREIGN_LANGUAGE,
                        FOREIGN_LANGUAGE
                    );
                    if (mnName && !mnName.match(/[a-z]/)) {
                        potentialCats.push(mnName);
                    }
                }
                let newMnCats: string[] = [
                    ...(row["mncategories"]?.split("\n") || []),
                    ...potentialCats.map((cat) => cat.replace("Ангилал:", "")),
                ];
                console.log(newMnCats);
                row["mncategories"] = [...new Set(newMnCats)]
                    .filter((cat) => !!cat)
                    .sort()
                    .join("\n");
                row[`${FOREIGN_LANGUAGE}categories`] =
                    row[`${FOREIGN_LANGUAGE}categories`] ||
                    "" +
                    categories
                        .map((cat) =>
                            cat
                                .replace("Kategorie:", "")
                                .replace("Категория:", "")
                                .replace("Category:", "")
                        )
                        .join("\n");

                await row.save();
            } else {
                console.log(`No ${FOREIGN_LANGUAGE} name`);
            }

            await new Promise((r) => setTimeout(r, TIMEOUT));
        }

        await foreignBot.logout();
    }
};

export default translateCats;
