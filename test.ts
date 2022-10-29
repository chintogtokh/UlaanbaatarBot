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

  const pages = await bot.getPagesInCategory("Ангилал:Сурвалж бичиг");

  for await (const element of pages) {
    console.log(element);

    bot.edit(element, (rev) => {
      let text = rev.content.replace(
        /\[\[Ангилал\: ?Сурвалж бичиг\]\]/g,
        "[[Ангилал:Монголын түүхийн сурвалж бичиг]]"
      );
      return {
        text: text,
        summary:
          "[[Ангилал:Сурвалж бичиг]]-ийг [[Ангилал:Монголын түүхийн сурвалж бичиг]]-аар сольж байна",
        minor: true,
      };
    });

    console.log(1);

    await new Promise((r) => setTimeout(r, 5000));
  }
};

renameCategories();
