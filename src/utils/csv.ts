import * as fs from "fs";

// Example
// Монголын театрын байгууламж,en:Theatres in Mongolia,{{commonscat|Theatres in Mongolia}},Монголын театр,Монголын барилга байгууламж

type CsvRow = {
  name: string;
  interwiki?: {
    lang: string;
    name: string;
  };
  content: string;
  categories: string[];
};

export const readFromCsv = (FILE: string): CsvRow[] => {
  const arr = simpleReadFromCsv(FILE);
  const pages: CsvRow[] = [];
  arr.forEach((element) => {
    if (element.length > 3) {
      pages.push({
        name: element[0],
        interwiki: element[1]
          ? {
              lang: element[1].split(":")[0],
              name: element[1].slice(element[1].indexOf(":") + 1),
            }
          : undefined,
        content: element[2] ?? "",
        categories: element.slice(3) ?? [],
      });
    }
  });
  return pages;
};

export const simpleReadFromCsv = (FILE: string): string[][] => {
  const pages: string[][] = [];
  const arr = fs.readFileSync(FILE).toString().split("\n");
  arr.forEach((element) => {
    if (!element.startsWith("#")) {
      const pieces = element.replace("\\,", "[COMMAHERE]").split(",");
      pages.push(
        pieces.map((piece: string) => {
          if (piece === "null") return "";
          return piece.replace("[COMMAHERE]", ",");
        })
      );
    }
  });
  return pages;
};
