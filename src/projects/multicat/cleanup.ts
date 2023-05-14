import { simpleReadFromCsv } from "../../utils/csv";
import * as fs from "fs";

const main = async () => {
  const articles = simpleReadFromCsv("./test.csv");
  fs.writeFileSync("./test1.csv", "");
  for (const a of articles) {
    const name = a[0];
    const categories = a
      .slice(1)
      .filter((v) => {
        const lower = v.toLowerCase();
        if (lower.indexOf("articles ") > -1) {
          return false;
        }
        if (lower.indexOf(" articles") > -1) {
          return false;
        }
        if (lower.indexOf(" stubs") > -1) {
          return false;
        }
        if (lower.indexOf("cs1") > -1) {
          return false;
        }
        return true;
      })
      .map((v) => {
        if (v === "Wrestlers at the 1968 Summer Olympics")
          return "1968 оны зуны олимпод оролцогч";
        if (v.endsWith(" births")) {
          return v.replace(" births", " онд төрсөн");
        }
        if (v.endsWith(" deaths")) {
          return v.replace(" deaths", " онд өнгөрсөн");
        }
        return v;
      });

    const stringToWrite = `${name},${categories.join(",")}\n`;
    fs.appendFileSync("./test1.csv", stringToWrite);
  }
};

main();
