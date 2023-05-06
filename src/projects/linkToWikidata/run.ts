import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import {
  connectMnToEn,
  getWikidataIdsGeneric,
} from "../../utils/wikidataUtils";
import { simpleReadFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();
  const linksneeded = simpleReadFromCsv("./src/projects/linkToWikidata/1.csv");
  for await (const item of linksneeded) {
    await connectMnToEn(bot, item[0], item[1]);
    await new Promise((r) => setTimeout(r, TIMEOUT));
  }
};

linkToWikidata();
