import { ApiParams, mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";
import * as fs from "fs";
import { BotConfig, LangBotConfig } from "../utils/bot";

dotenv.config();

const FILE = "/Users/chintogtokh/dev/UlaanbaatarBot/src/uncategorised/data.txt";
const OUTPUTFILE = `/Users/chintogtokh/dev/UlaanbaatarBot/src/uncategorised/checkedoutput${new Date().toISOString()}.txt`;

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const getCategories = async (
    title: string,
    fromLang: string = "mn"
  ): Promise<false | string[]> => {
    const params: ApiParams = {
      prop: "categories",
      titles: title,
      cllimit: 500,
    };

    const content = fromLang == "mn" ? await bot.query(params) : [];

    if (content?.query?.pages?.[0].missing == true) {
      return false;
    }
    return content?.query?.pages?.[0]?.categories || [];
  };

  const retrieveParseList = () => {
    const articles: string[] = [];
    const arr = fs.readFileSync(FILE).toString().split("\n");
    articles.push(...arr);
    return articles;
  };

  const writeToOutput = (title: string) => {
    console.log("Writing to file: ", title);
    fs.appendFileSync(OUTPUTFILE, `${title}\n`);
  };

  const articles = retrieveParseList();

  for await (const article of articles) {
    console.log(`Parsing ${article}: \n`);
    const categories = await getCategories(article, "mn");
    if (categories !== false && categories?.length === 0) {
      writeToOutput(article);
    }
    await new Promise((r) => setTimeout(r, 700));
  }
};

main();
