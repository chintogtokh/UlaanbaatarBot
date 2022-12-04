import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";

const FROM_CATEGORY = "Ангилал:Хууль сахиулах байгууллага";
const TO_CATEGORY = "Ангилал:Хууль сахиулах";

const renameCategories = async () => {
  const bot = new mwn(BotConfig);
  await bot.login();

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

    await bot.move(
      FROM_CATEGORY,
      TO_CATEGORY,
      `[[${FROM_CATEGORY}]]-ийг [[${TO_CATEGORY}]]-аар сольж байна`
    );

    await new Promise((r) => setTimeout(r, 2000));
  }
};

renameCategories();
