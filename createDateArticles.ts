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

const createDateArticles = async () => {
  const bot = new mwn(config);

  console.log(config);

  await bot.login();

  //   const bornIn = [
  //     1584, 1585, 1587, 1597, 1692, 1254, 1362, 1524, 1540, 1543, 1573, 1575,
  //     1580, 1583, 1609, 1610, 1613, 1614, 1615, 2008, 685,
  //   ];
  //   const diedIn = [
  //     1648, 1624, 1692, 1705, 1353, 1615, 1618, 1622, 1633, 1635, 1636, 1639,
  //     1673, 1718, 1763, 1770, 46,
  //   ];

  const years = [
    1499, 1501, 1502, 1503, 1508, 1516, 1518, 1524, 1531, 1535, 1536, 1539,
    1553, 1558, 1560, 1565, 1570, 1576, 1580, 1590,
  ];

  for await (const year of years) {
    const title = `Ангилал:${year} он`;
    const content = `{{Commonscat|${year}}}\n[[Ангилал:${year
      .toString()
      .slice(0, 3)}0-д он|#]]`;
    const summary = "Автоматаар үүсгэж байна";

    console.log(title);
    console.log(content);

    await bot.create(title, content, summary);

    await new Promise((r) => setTimeout(r, 5000));
  }

  //   for await (const year of bornIn) {
  //     const title = `Ангилал:${year} онд төрсөн`;
  //     const content = `{{birthyr|${year.toString().slice(0, 3)}|${year
  //       .toString()
  //       .slice(
  //         3,
  //         4
  //       )}}}\n{{Commonscat|${year} births|{{PAGENAME}}}}\n[[Ангилал:Төрсөн (${Math.floor(
  //       year / 100 + 1
  //     )}-р зуун)|#]]`;
  //     const summary = "Автоматаар үүсгэж байна";

  //     console.log(title);
  //     console.log(content);

  //     await bot.create(title, content, summary);

  //     await new Promise((r) => setTimeout(r, 5000));
  //   }

  //   for await (const year of diedIn) {
  //     const title = `Ангилал:${year} онд өнгөрсөн`;
  //     const content = `{{deathyr|${year.toString().slice(0, 3)}|${year
  //       .toString()
  //       .slice(
  //         3,
  //         4
  //       )}}}\n{{Commonscat|${year} deaths|{{PAGENAME}}}}\n[[Ангилал:Өнгөрсөн (${Math.floor(
  //       year / 100 + 1
  //     )}-р зуун)|#]]`;
  //     const summary = "Автоматаар үүсгэж байна";

  //     console.log(title);
  //     console.log(content);

  //     await bot.create(title, content, summary);

  //     await new Promise((r) => setTimeout(r, 5000));
  //   }
};

createDateArticles();
