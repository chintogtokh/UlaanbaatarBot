import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";
import * as readline from "readline";

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    await bot.getTokens();

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

    const token = await bot.getCsrfToken();

    const params: ApiParams = {
      action: "wblinktitles",
      fromsite: "mnwiki",
      fromtitle: mnArticle,
      tosite: "enwiki",
      totitle: enArticle,
      token,
    };

    const result = await bot
      .query(params)
      .catch((e) => console.log("Error occured: ", e));

    console.log(result);

    await new Promise((r) => setTimeout(r, 1500));
  }
};

linkToWikidata();
