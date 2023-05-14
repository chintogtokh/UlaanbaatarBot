import { simpleReadFromCsv } from "../../utils/csv";
import * as fs from "fs";

const main = async () => {
  const articles = simpleReadFromCsv("./oof.csv");
  fs.writeFileSync("./catsallpeopleALL.csv", "");
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
        if (lower.indexOf(" mdy ") > -1) {
          return false;
        }
        if (lower.indexOf("cleanup") > -1) {
          return false;
        }
        if (lower.indexOf(" dmy ") > -1) {
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

    const newcats = [...new Set(categories)];

    const stringToWrite = `${name},${newcats.join(",")}\n`;
    fs.appendFileSync("./catsallpeopleALL.csv", stringToWrite);
  }
};

const merge = () => {
  const orig = simpleReadFromCsv("./catsallpeople.csv");
  const de = simpleReadFromCsv("./testde.csv");

  const all = [...new Set([...orig.map((v) => v[0]), ...de.map((v) => v[0])])];

  console.log(orig);

  fs.writeFileSync("./oof.csv", "");
  for (const article of all) {
    let cats: string[] = [];

    const deCats = de.filter((v) => v[0] === article)?.[0];
    const enCats = orig.filter((v) => v[0] === article)?.[0];
    if (enCats?.length > 1) cats.push(...enCats);
    if (deCats?.length > 1) cats.push(...deCats);

    console.log(enCats);

    const thing = `${article},${cats.join(",")}\n`;
    fs.appendFileSync("./oof.csv", thing);
  }
};

// merge();
main();
