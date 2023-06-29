import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import * as readline from "readline";
import { connectMnToEn } from "../../utils/wikidataUtils";

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

    await connectMnToEn(bot, mnArticle, enArticle);

    await new Promise((r) => setTimeout(r, 1500));
  }
};

linkToWikidata();
