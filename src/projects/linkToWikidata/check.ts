import { ApiParams, mwn } from "mwn";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import {
  connectMnToEn,
  connectedOrNot,
  getWikidataIdsGeneric,
} from "../../utils/wikidataUtils";
import { simpleReadFromCsv } from "../../utils/csv";
import { TIMEOUT } from "../../utils/vars";
import * as fs from "fs";

const checkWikidata = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();
  let listofarticles = simpleReadFromCsv("./allpeople.csv");

  for await (const ar of listofarticles) {
    const result = await connectedOrNot(bot, ar[0]);
    const data = `"${ar}",${result}\n`;
    fs.appendFileSync("./test.txt", data);
  }
};

checkWikidata();
