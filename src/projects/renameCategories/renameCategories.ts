import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";

const FROM_CATEGORY = "Ангилал:Аюулгүй байдал";
const TO_CATEGORY = "Ангилал:Аюулгүйн хамгаалалт";

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pages = await bot.getPagesInCategory("Ангилал:Аюулгүй байдал");

  for await (const element of pages) {
    console.log(element);

    // test later, delete this comment
    bot.edit(element, (rev) => {
      let text = rev.content.replace(
        new RegExp(`\\\[\\\[${FROM_CATEGORY}`, "g"),
        `[[${TO_CATEGORY}`
      );
      return {
        text: text,
        summary: `[[${FROM_CATEGORY}]]-ийг [[${TO_CATEGORY}]]-аар сольж байна`,
        minor: true,
      };
    });

    await new Promise((r) => setTimeout(r, 5000));
  }
};

renameCategories();
