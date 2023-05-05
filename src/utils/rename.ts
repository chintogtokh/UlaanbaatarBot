import { mwn } from "mwn";

export const renameCategory = async (bot: mwn, from: string, to: string) => {
  console.log(`Processing: ${from} to ${to}`);

  const pages = await bot.getPagesInCategory(from);

  console.log(pages);

  for await (const element of pages) {
    console.log(element);

    // test later, delete this comment
    bot.edit(element, (rev) => {
      let text = rev.content.replace(
        new RegExp(`\\\[\\\[${from}`, "g"),
        `[[${to}`
      );
      return {
        text: text,
        summary: `[[${from}]]-ийг [[${to}]]-аар сольж байна`,
        minor: true,
      };
    });
    await new Promise((r) => setTimeout(r, 3000));
  }

  await bot.move(from, to, `[[${from}]]-ийг [[${to}]]-аар сольж байна`);
};
