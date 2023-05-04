import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import {
  connectMnToEn,
  getWikidataIdsGeneric,
} from "../../utils/wikidataUtils";

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();
  const linksneeded = [
    ["Ангилал:1000 онд байгуулагдсан", "Category:1000 establishments"],
  ];
  for await (const item of linksneeded) {
    await connectMnToEn(bot, item[0], item[1]);
    await new Promise((r) => setTimeout(r, 1500));
  }
};

linkToWikidata();
