import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";

const FROM_CATEGORY = "Ангилал:Монгол улсын ерөнхийлөгч";
const TO_CATEGORY = "Ангилал:Монгол Улсын Ерөнхийлөгч";

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  const pages = await bot.getPagesInCategory(FROM_CATEGORY);

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

    await new Promise((r) => setTimeout(r, 2000));
  }
};

renameCategories();
