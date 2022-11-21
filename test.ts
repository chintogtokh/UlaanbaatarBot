import { mwn } from "mwn";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

const renameCategories = async () => {
  const bot = new mwn(config);

  await bot.login();

  // bot.create(
  //   "Хэрэглэгчийн_яриа:UlaanbaatarBot",
  //   "Hello world --~~~~",
  //   "Hello world (testing bot)"
  // );

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

    console.log(1);

    await new Promise((r) => setTimeout(r, 1500));
  }
};

renameCategories();
