import { mwn } from "mwn";
import * as fs from "fs";
import { BotConfig } from "../../utils/bot";
import { readFromCsv } from "../../utils/csv";

const langs = [
  "da",
  "de",
  "et",
  "eu",
  "ff",
  "fj",
  "fo",
  "ga",
  "gr",
  "hsb",
  "hu",
  "id",
  "is",
  "it",
  "ja",
  "jp",
  "kg",
  "kl",
  "km",
  "kn",
  "ku",
  "la",
  "lb",
  "lij",
  "lmo",
  "lo",
  "lv",
  "mn",
  "ms",
  "nl",
  "oc",
  "os",
  "ota",
  "pl",
  "pms",
  "ps",
  "pt",
  "rm",
  "ro",
  "rw",
  "sah",
  "sc",
  "scn",
  "se",
  "sg",
  "si",
  "sk",
  "sl",
  "sq",
  "sr",
  "sw",
  "th",
  "tk",
  "tl",
  "tyv",
  "uk",
  "vi",
  "xal",
  "za",
];

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  for await (const lang of langs) {
    console.log(lang);

    await bot.edit(`Загвар:Lang-${lang}`, (rev) => {
      const index = rev.content.indexOf("<noinclude");
      const firstLine = rev.content.slice(0, index);
      const text = `''${firstLine.replace(
        "''{{{1}}}''",
        "{{{1}}}"
      )}''${rev.content.slice(index)}`;
      console.log(text);
      return {
        text,
        summary: "Засав",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 2000));
  }
};

main();
