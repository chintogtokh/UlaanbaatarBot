import * as dotenv from "dotenv";

dotenv.config();

export const BotConfig = {
  apiUrl: "https://mn.wikipedia.org/w/api.php",
  username: `${process.env.USERNAME}`,
  password: `${process.env.PASSWORD}`,
  userAgent: "UlaanbaatarBot 0.01 ([[User:UlaanbaatarBot]])",
  defaultParams: { assert: "user" },
};
