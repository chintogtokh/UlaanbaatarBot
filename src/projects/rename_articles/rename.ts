import { mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig } from "../../utils/bot";

dotenv.config();

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pages = await bot.getPagesInCategory("Ангилал:Программ хангамж");

  for await (const element of pages) {
    console.log(element);

    bot.edit(element, (rev) => {
      let text = rev.content.replace(
        /\[\[Ангилал:Программ хангамж/g,
        "[[Ангилал:Програм хангамж"
      );
      return {
        text: text,
        summary:
          "[[Ангилал:Программ хангамж]]-ийг [[Ангилал:Програм хангамж]]-аар сольж байна",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 5000));
  }
};

renameCategories();
