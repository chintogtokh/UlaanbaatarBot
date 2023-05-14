import { ApiParams, mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";
import * as fs from "fs";
import { BotConfig, LangBotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { simpleReadFromCsv } from "../../utils/csv";

dotenv.config();

const FOREIGN_LANGUAGE = "en";

const getInOtherLanguage = async (
  bot: mwn,
  engBot: mwn,
  title: string,
  fromLang: string
) => {
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

const getCategories = async (
  bot: mwn,
  engBot: mwn,
  title: string,
  fromLang: string
) => {
  const params: ApiParams = {
    prop: "categories",
    titles: title,
    cllimit: 500,
  };

  const content =
    fromLang == "mn" ? await bot.query(params) : await engBot.query(params);
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
      console.log(low);
      return true;
    });
  return parsed;
};

const addCategoryLoop = async (
  bot: mwn,
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

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const engBot = new mwn(LangBotConfig(FOREIGN_LANGUAGE));
  await engBot.login();

  const articles = simpleReadFromCsv("./allpeople.csv").map(
    (row: string[]) => row[0]
  );

  const writeToFile = (
    article: string,
    categories: string[],
    potentialCats: string[]
  ) => {
    const data =
      article +
      "," +
      potentialCats
        .map((val: string) => val.replace(",", ",").replace("Ангилал:", ""))
        .join(",") +
      "," +
      categories
        .map((val: string) => val.replace(",", ",").replace("Category:", ""))
        .join(",") +
      "\n";
    fs.appendFileSync("./test.csv", data);
  };

  for await (const article of articles) {
    console.log(`Parsing ${article}: \n`);
    const engName = await getInOtherLanguage(bot, engBot, article, "mn");
    if (engName) {
      const categories = await getCategories(
        bot,
        engBot,
        engName,
        FOREIGN_LANGUAGE
      );
      const potentialCats: string[] = [];
      for await (const cat of categories) {
        const mnName = await getInOtherLanguage(
          bot,
          engBot,
          cat,
          FOREIGN_LANGUAGE
        );
        if (mnName && !mnName.match(/[a-z]/)) {
          potentialCats.push(mnName);
        }
      }
      console.log(categories);
      console.log(potentialCats);
      writeToFile(article, categories, potentialCats);
      // await addCategoryLoop(bot, article, potentialCats);
    } else {
      console.log(`No ${FOREIGN_LANGUAGE} name`);
    }

    await new Promise((r) => setTimeout(r, TIMEOUT));
  }
};

main();
