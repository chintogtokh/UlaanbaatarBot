import { mwn } from "mwn";
import * as dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

const iin = (val: string) => {
  const matcher = val.match(/[аиоөуүэ]/);
  if (!matcher?.[0]) {
    return false;
  }
  if ("аоу".includes(matcher[0])) {
    return "эр";
  }
  return "эм";
};

const suurin = async () => {
  const bot = new mwn(config);

  console.log(config);

  await bot.login();

  const articles = [
    "Айрагийн хүн",
    // "Ядмаагийн Батболд",
    // "Янжинлхамын Мөнхтөр",
  ];

  for await (const article of articles) {
    bot.edit(article, (rev) => {
      const cat = article
        .replace("гийн хүн", "")
        .replace("гийн хүн", "")
        .replace("гийн хүн", "")
        .replace("гийн хүн", "")
        .replace("гийн хүн", "")
        .replace("гийн хүн", "")
        .replace("гийн хүн", "");
      let text = rev.content + "\n" + `[[Ангилал:${v}]]`;
      console.log(text);
      return {
        text: text,
        summary: "Анги нэмэв",
        minor: true,
      };
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
};

suurin();
