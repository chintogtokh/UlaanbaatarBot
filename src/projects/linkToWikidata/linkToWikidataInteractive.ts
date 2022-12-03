import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import * as readline from "readline";

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

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const mnArticle: string = await new Promise((resolve) => {
      rl.question("Add an mn article name: ", resolve);
    });

    const enArticle: string = await new Promise((resolve) => {
      rl.question("Add an en article name: ", resolve);
    });

    let proceed: string;
    do {
      proceed = await new Promise((resolve) => {
        rl.question("Proceed? Yes/No/Exit (y/n/x): ", resolve);
      });
    } while (!["x", "y", "n"].includes(proceed));

    if (proceed == "x") {
      break;
    }
    if (proceed == "n") {
      continue;
    }

    console.log(`Processing: ${mnArticle} to ${enArticle}`);

    await bot.getTokens();
    const token = await bot.getCsrfToken();

    const params: ApiParams = {
      action: "wblinktitles",
      fromsite: "mnwiki",
      fromtitle: mnArticle,
      tosite: "enwiki",
      totitle: enArticle,
      token,
    };

    const result = await bot.query(params).catch(async (e: any) => {
      console.log("Error occured, try merging: ", e);
      const wikiDataIds = await getWikidataIds(bot, mnArticle, enArticle);
      if (wikiDataIds) {
        const mergeParams: ApiParams = {
          action: "wbmergeitems",
          fromid: wikiDataIds.mn,
          toid: wikiDataIds.en,
          token: token,
        };

        const nextResult = await bot.query(mergeParams);
        console.log(nextResult);
      } else {
        console.log("Not mergeable");
      }
    });

    await new Promise((r) => setTimeout(r, 1500));
  }
};

linkToWikidata();
