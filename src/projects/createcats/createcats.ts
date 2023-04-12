import * as dotenv from "dotenv";
import * as fs from "fs";
import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";

dotenv.config();

type WikibaseEntity = {
  entities: {
    [key: string]: {
      pageid: number;
      title: string;
      sitelinks: any;
    };
  };
  success: boolean;
};

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

const wikidatabot = new mwn(WikidataBotConfig());
wikidatabot.login(); // suss

const readFromCsv = () => {
  const FILE =
    "/home/chintogtokh/dev/UlaanbaatarBot/src/projects/createcats/data.csv";
  const articles: string[] = [];
  const arr = fs.readFileSync(FILE).toString().split("\n");
  articles.push(...arr);
  return articles;
};

export const getWikidataIds = async (
  bot: mwn,
  mnArticle: string,
  enArticle: string
) => {
  console.log("TRY MERGE");

  const paramsFetchMn: ApiParams = {
    action: "wbgetentities",
    sites: "mnwiki",
    titles: mnArticle,
  };

  const paramsFetchEn: ApiParams = {
    action: "wbgetentities",
    sites: "enwiki",
    titles: enArticle,
  };

  const result = (await bot
    .query(paramsFetchMn)
    .catch((e: any) => console.log("Error occured: ", e))) as WikibaseEntity;
  const keys = Object.keys(result?.entities);

  if (keys.length === 1) {
    console.log("Can merge");
    const mnWikidataId = keys[0];

    const enResult = (await bot
      .query(paramsFetchEn)
      .catch((e: any) => console.log("Error occured: ", e))) as WikibaseEntity;
    const enWikidataId = Object.keys(enResult?.entities)[0];

    return { en: enWikidataId, mn: mnWikidataId };
  }
  console.log(keys);
  return false;
};

const linkcategorytowikidata = async (mn: string, interwiki: string) => {
  const token = await wikidatabot.getCsrfToken();

  const langWiki = interwiki.split(":")[0];
  const en = interwiki.split(":")[1];

  const mnArticle = `Ангилал:${mn}`;
  const toArticle = `Category:${en}`;

  const params: ApiParams = {
    action: "wblinktitles",
    fromsite: "mnwiki",
    fromtitle: mnArticle,
    tosite: `${langWiki}wiki`,
    totitle: toArticle,
    token,
  };

  const result = await wikidatabot
    .query(params)
    .then(() => console.log("   Added interwiki"))
    .catch(async (e: any) => {
      console.log("Error occured, try merging: ", e);
      const wikiDataIds = await getWikidataIds(
        wikidatabot,
        mnArticle,
        toArticle
      );
      if (wikiDataIds) {
        const mergeParams: ApiParams = {
          action: "wbmergeitems",
          fromid: wikiDataIds.mn,
          toid: wikiDataIds.en,
          token: token,
        };

        const nextResult = await wikidatabot.query(mergeParams);
        console.log(nextResult);
      } else {
        console.log("Not mergeable");
      }
    });

  await new Promise((r) => setTimeout(r, 1500));
};

const createCatArticles = async () => {
  const bot = new mwn(config);
  await bot.login();

  const categoriesToAdd = readFromCsv();

  for await (const category of categoriesToAdd.slice(1)) {
    const summary = "Анги үүсгэж байна";
    const split = category.split(",");
    const name = split[0];
    const interwiki = split[1];
    const textcontent = split[2];
    const cats = split.slice(3);

    const content = [
      textcontent,
      ...cats.map((catName: string) => `[[Ангилал:${catName}]]`),
    ].join("\n");

    console.log(name);
    console.log(content);

    await bot.create(`Ангилал:${name}`!, content!, summary);
    await new Promise((r) => setTimeout(r, 1000));
    await linkcategorytowikidata(name, interwiki);
    await new Promise((r) => setTimeout(r, 1000));
  }
};

createCatArticles();
