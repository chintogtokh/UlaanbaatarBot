import { mwn } from "mwn";
import * as dotenv from "dotenv";

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
}

const categoryName = (year: number, type: string) => {
  switch (type) {
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

  const yearsToAdd = {
    [ArticleType.BornIn]: [],
    [ArticleType.DiedIn]: [],
    [ArticleType.Year]: [55],
  };

  for (const articleType of Object.keys(ArticleType)) {
    for await (const year of yearsToAdd[articleType]) {
      const summary = "Автоматаар үүсгэж байна";
      const name = categoryName(year, articleType);
      const content = categoryContent(year, articleType);

      console.log(name);
      console.log(content);

      await bot.create(name!, content!, summary);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
};

createDateArticles();
