import { mwn } from "mwn";
import * as dotenv from "dotenv";
import { BotConfig } from "../../utils/bot";

dotenv.config();

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pages = await bot.getPagesInCategory("Ангилал:Аюулгүй байдал");

  for await (const element of pages) {
    console.log(element);

    bot.edit(element, (rev) => {
      let text = rev.content.replace(
        /\[\[Ангилал:Аюулгүй байдал/g,
        "[[Ангилал:Аюулгүйн хамгаалалт"
      );
      return {
        text: text,
        summary:
          "[[Ангилал:Аюулгүй байдал]]-ийг [[Ангилал:Аюулгүйн хамгаалалт]]-аар сольж байна",
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 5000));
  }
};

renameCategories();
