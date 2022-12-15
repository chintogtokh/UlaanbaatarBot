import { mwn } from "mwn";
import CategoryConfig from "./config";
import { BotConfig } from "../../utils/bot";

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

  for await (const category of CategoryConfig) {
    const FROM_CATEGORY = category.from;
    const TO_CATEGORY = category.to;

    console.log(`Processing: ${FROM_CATEGORY} to ${TO_CATEGORY}`);

    const pages = await bot.getPagesInCategory(FROM_CATEGORY);

    console.log(pages);

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
      await new Promise((r) => setTimeout(r, 1000));
    }

    await bot.move(
      FROM_CATEGORY,
      TO_CATEGORY,
      `[[${FROM_CATEGORY}]]-ийг [[${TO_CATEGORY}]]-аар сольж байна`
    );
  }
};

renameCategories();
