import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { renameCategory } from "../../utils/rename";
import { simpleReadFromCsv } from "../../utils/csv";

const main = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pages = simpleReadFromCsv("./src/projects/csv/data/renameCat.csv");

  for await (const page of pages) {
    await renameCategory(bot, page[0], page[1]);
  }
};

main();
