import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import { getWikidataIds } from "./linkToWikidataInteractive";

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();

  // mn, en
  const linksneeded = [["Бизнесийн оюун ухаан", "Business intelligence"]];

  for await (const item of linksneeded) {
    await bot.getTokens();

    console.log(`Processing: ${item[0]} to ${item[1]}`);

    const token = await bot.getCsrfToken();

    const mnArticle = item[0];
    const enArticle = item[1];

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
