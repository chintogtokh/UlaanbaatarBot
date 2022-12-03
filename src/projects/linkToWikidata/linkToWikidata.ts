import { ApiParams, mwn } from "mwn";
import { WikidataBotConfig } from "../../utils/bot";

const linkToWikidata = async () => {
  const bot = new mwn(WikidataBotConfig());
  await bot.login();

  // mn, en
  const linksneeded = [
    ["Ангилал:1580 он", "Category:1580"],
    ["Ангилал:1576 он", "Category:1576"],
  ];

  for await (const item of linksneeded) {
    await bot.getTokens();

    console.log(`Processing: ${item[0]} to ${item[1]}`);

    const token = await bot.getCsrfToken();

    const params: ApiParams = {
      action: "wblinktitles",
      fromsite: "mnwiki",
      fromtitle: item[0],
      tosite: "enwiki",
      totitle: item[1],
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
