import { mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig, WikidataBotConfig } from "../../utils/bot";
import { connectArticles, connectMnToEn } from "../../utils/wikidataUtils";
import { TIMEOUT } from "../../utils/vars";

dotenv.config();

enum ArticleType {
  Year = "Year",
  DiedIn = "DiedIn",
  BornIn = "BornIn",
  YearEstablished = "YearEstablished",
}

const yearsToAdd = {
  [ArticleType.BornIn]: [],
  [ArticleType.DiedIn]: [],
  [ArticleType.Year]: [],
  [ArticleType.YearEstablished]: [],
};

const data: {
  [key in ArticleType]: {
    en: (year: number) => string;
    mn: (year: number) => string;
    mnContent: (year: number) => string;
  };
} = {
  [ArticleType.Year]: {
    en: (year: number) => `Category:${year}`,
    mn: (year: number) => `Category:${year} он`,
    mnContent: (year: number) =>
      `{{Commonscat|${year}}}\n[[Ангилал:${Math.floor(year / 10) * 10
      }-д он|#]]`,
  },
  [ArticleType.DiedIn]: {
    en: (year: number) => `Category:${year} deaths`,
    mn: (year: number) => `Category:${year} онд өнгөрсөн`,
    mnContent: (year: number) =>
      `{{deathyr|${year.toString().slice(0, 3)}|${year
        .toString()
        .slice(
          3,
          4
        )}}}\n{{Commonscat|${year} deaths|{{PAGENAME}}}}\n[[Ангилал:Өнгөрсөн (${Math.floor(
          year / 100 + 1
        )}-р зуун)|#]]`,
  },
  [ArticleType.BornIn]: {
    en: (year: number) => `Category:${year} births`,
    mn: (year: number) => `Category:${year} онд төрсөн`,
    mnContent: (year: number) =>
      `{{birthyr|${year.toString().slice(0, 3)}|${year
        .toString()
        .slice(
          3,
          4
        )}}}\n{{Commonscat|${year} births|{{PAGENAME}}}}\n[[Ангилал:Төрсөн (${Math.floor(
          year / 100 + 1
        )}-р зуун)|#]]`,
  },
  [ArticleType.YearEstablished]: {
    en: (year: number) => `Category:${year} establishments`,
    mn: (year: number) => `Category:${year} онд байгуулагдсан`,
    mnContent: (
      year: number
    ) => `{{Commonscat|${year} establishments|${year} онд байгуулагдсан}}
    {{Байгуулагдсан он|${year}}}
    [[Ангилал:${Math.floor(year / 10) * 10}-д онд байгуулагдсан|#]]
    `,
  },
};

const createDateArticles = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const wikidatabot = new mwn(WikidataBotConfig());
  await wikidatabot.login();

  for (const articleType of Object.keys(ArticleType)) {
    for await (const year of yearsToAdd[articleType as ArticleType]) {
      const summary = "Үүсгэж байна";
      const name = data[articleType as ArticleType].mn(year);
      const content = data[articleType as ArticleType].mnContent(year);
      const enName = data[articleType as ArticleType].en(year);

      console.log(name);
      console.log(content);

      await bot.create(name!, content!, summary);
      await new Promise((r) => setTimeout(r, TIMEOUT));

      await connectMnToEn(wikidatabot, name, enName);

      await new Promise((r) => setTimeout(r, TIMEOUT));
    }
  }
};

createDateArticles();
