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

  const articles = await bot.getPagesInCategory(
    "Ангилал:Монголын хүн суурингаар"
  );

  for await (const article of articles) {
    // Get potential soum name
    const withoutPerson = article.replace(" хүн", "");
    const names: string[] = [];

    if (withoutPerson.endsWith("ы")) {
      names.push(withoutPerson.slice(0, -1));
    }

    if (withoutPerson.endsWith("ий")) {
      names.push(withoutPerson.slice(0, -2));
    }

    if (withoutPerson.endsWith("гийн")) {
      names.push(withoutPerson.slice(0, -4));
    } else if (withoutPerson.endsWith("ийн")) {
      names.push(withoutPerson.slice(0, -3));
      names.push(withoutPerson.slice(0, -2));
    } else if (withoutPerson.endsWith("йн")) {
      names.push(withoutPerson.slice(0, -1));
      names.push(withoutPerson.slice(0, -2) + "ь");
    }

    if (withoutPerson.endsWith("ын")) {
      names.push(withoutPerson.slice(0, -2));
    }

    console.log(article, JSON.stringify(names.map((v) => `${v} сум`)));

    // Create soum category

    // Save soum category into article

    // bot.edit(article, (rev) => {
    //   const cat = article
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "")
    //     .replace("гийн хүн", "");
    //   let text = rev.content + "\n" + `[[Ангилал:${v}]]`;
    //   console.log(text);
    //   return {
    //     text: text,
    //     summary: "Анги нэмэв",
    //     minor: true,
    //   };
    // });
    // await new Promise((r) => setTimeout(r, 2000));
  }
};

suurin();
