import * as dotenv from "dotenv";

dotenv.config();

export const BotConfig = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

export const EnglishBotConfig = {
  apiUrl: "https://en.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};

export const LangBotConfig = (lang: string) => ({
  apiUrl: `https://${lang}.wikipedia.org/w/api.php`,
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
});

export const WikidataBotConfig = () => ({
  apiUrl: `https://www.wikidata.org/w/api.php`,
  username: `${process.env.USERNAMEADMIN}`,
  password: `${process.env.PASSWORDADMIN}`,
  userAgent: "User:Chinneeb as UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
});
