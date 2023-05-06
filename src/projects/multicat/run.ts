import { ApiParams, mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";
import * as fs from "fs";
import { BotConfig, LangBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";

dotenv.config();

const FOREIGN_LANGUAGE = "en";

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const engBot = new mwn(LangBotConfig(FOREIGN_LANGUAGE));
  await engBot.login();

  const getInOtherLanguage = async (title: string, fromLang: string) => {
    const params: ApiParams = {
      prop: "langlinks",
      titles: title,
      lllimit: 500,
    };

    const content =
      fromLang === "mn" ? await bot.query(params) : await engBot.query(params);

    const toLang = fromLang == "mn" ? FOREIGN_LANGUAGE : "mn";
    const langlinks: { lang: string; title: string }[] =
      content.query?.pages[0].langlinks;

    return langlinks?.filter((v) => v.lang == toLang)?.[0]?.title || false;
  };

  const getCategories = async (title: string, fromLang: string) => {
    const params: ApiParams = {
      prop: "categories",
      titles: title,
      cllimit: 500,
    };

    const content =
      fromLang == "mn" ? await bot.query(params) : await engBot.query(params);
    return content?.query?.pages?.[0]?.categories;
  };

  const addCategoryLoop = async (
    articleTitle: string,
    existingCategories: string[]
  ) => {
    const categories: string[] = [];
    categories.push(...existingCategories);

    console.log("Categories to add: " + categories.join("\n"));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const answer: string = await new Promise((resolve) => {
        rl.question("Add a new category or use XXX to finish:", resolve);
      });

      if (answer == "XXX") {
        break;
      }

      categories.push(`Ангилал:${answer}`);
    }

    console.log(categories.map((v) => `[[${v}]]`).join("\n"));

    bot.edit(articleTitle, (rev) => {
      let text =
        rev.content + "\n" + categories.map((v) => `[[${v}]]`).join("\n");
      console.log(text);
      return {
        text: text,
        summary: "Анги нэмэв",
        minor: true,
      };
    });
  };

  const articles: string[] = [];

  const arr = fs
    .readFileSync("./src/projects/multicat/data.txt")
    .toString()
    .split("\n");

  articles.push(...arr);

  console.log(articles);

  for await (const article of articles) {
    console.log(`Parsing ${article}: \n`);
    const engName = await getInOtherLanguage(article, "mn");
    if (engName) {
      const categories = await getCategories(engName, FOREIGN_LANGUAGE);
      const potentialCats: string[] = [];
      for await (const cat of categories) {
        const mnName = await getInOtherLanguage(cat?.title, FOREIGN_LANGUAGE);
        if (mnName && !mnName.match(/[a-z]/)) {
          potentialCats.push(mnName);
        }
      }
      await addCategoryLoop(article, potentialCats);
    } else {
      console.log(`No ${FOREIGN_LANGUAGE} name`);
    }

    await new Promise((r) => setTimeout(r, TIMEOUT));
  }
};

main();
