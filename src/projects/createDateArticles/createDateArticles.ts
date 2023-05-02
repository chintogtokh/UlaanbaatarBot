import { ApiParams, mwn } from "mwn";
import * as dotenv from "dotenv";
import { WikidataBotConfig } from "../../utils/bot";
// import { getWikidataIds } from "../linkToWikidata/linkToWikidataInteractive";

//copied

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

dotenv.config();

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

enum ArticleType {
  Year = "Year",
  DiedIn = "DiedIn",
  BornIn = "BornIn",
  YearEstablished = "YearEstablished",
}

const categoryName = (year: number, type: string) => {
  switch (type) {
    case ArticleType.YearEstablished:
      return `Ангилал:${year} онд байгуулагдсан`;
    case ArticleType.Year:
      return `Ангилал:${year} он`;
    case ArticleType.DiedIn:
      return `Ангилал:${year} онд өнгөрсөн`;
    case ArticleType.BornIn:
      return `Ангилал:${year} онд төрсөн`;
    default:
      break;
  }
};

const categoryContent = (year: number, type: string) => {
  switch (type) {
    case ArticleType.YearEstablished:
      return `{{Commonscat|${year} establishments|${year} онд байгуулагдсан}}
      {{Байгуулагдсан он|${year}}}
      [[Ангилал:${Math.floor(year / 10) * 10}-д онд байгуулагдсан|#]]
      `;
    case ArticleType.Year:
      return `{{Commonscat|${year}}}\n[[Ангилал:${year
        .toString()
        .slice(0, 3)}0-д он|#]]`; // BUGGY!
    case ArticleType.DiedIn:
      return `{{deathyr|${year.toString().slice(0, 3)}|${year
        .toString()
        .slice(
          3,
          4
        )}}}\n{{Commonscat|${year} deaths|{{PAGENAME}}}}\n[[Ангилал:Өнгөрсөн (${Math.floor(
        year / 100 + 1
      )}-р зуун)|#]]`;
    case ArticleType.BornIn:
      return `{{birthyr|${year.toString().slice(0, 3)}|${year
        .toString()
        .slice(
          3,
          4
        )}}}\n{{Commonscat|${year} births|{{PAGENAME}}}}\n[[Ангилал:Төрсөн (${Math.floor(
        year / 100 + 1
      )}-р зуун)|#]]`;
    default:
      break;
  }
};

const createDateArticles = async () => {
  const bot = new mwn(config);
  await bot.login();

  const wikidatabot = new mwn(WikidataBotConfig());
  await wikidatabot.login();

  const yearsToAdd = {
    [ArticleType.BornIn]: [],
    [ArticleType.DiedIn]: [1321, 1681, 1701, 1725, 1728, 1771],
    [ArticleType.Year]: [],
    [ArticleType.YearEstablished]: [],
  };

  for (const articleType of Object.keys(ArticleType)) {
    for await (const year of yearsToAdd[articleType as ArticleType]) {
      const summary = "Үүсгэж байна";
      const name = categoryName(year, articleType);
      const content = categoryContent(year, articleType);

      console.log(name);
      console.log(content);

      await bot.create(name!, content!, summary);
      await new Promise((r) => setTimeout(r, 2000));

      //wikidata
      await wikidatabot.getTokens();

      const token = await wikidatabot.getCsrfToken();

      //BEWARE

      const mnArticle = `Ангилал:${year} онд өнгөрсөн`;
      const enArticle = `Category:${year} deaths`;

      const params: ApiParams = {
        action: "wblinktitles",
        fromsite: "mnwiki",
        fromtitle: mnArticle,
        tosite: "enwiki",
        totitle: enArticle,
        token,
      };

      const result = await wikidatabot.query(params).catch(async (e: any) => {
        console.log("Error occured, try merging: ", e);
        const wikiDataIds = await getWikidataIds(bot, mnArticle, enArticle);
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
      //wikidataend
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
};

createDateArticles();
