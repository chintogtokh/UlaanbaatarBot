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

const bot = new mwn(config);

bot.create(
  "Хэрэглэгчийн_яриа:UlaanbaatarBot",
  "Hello world --~~~~",
  "Hello world (testing bot)"
);
