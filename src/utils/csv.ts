import * as fs from "fs";

// Example
// Монголын театрын байгууламж,en:Theatres in Mongolia,{{commonscat|Theatres in Mongolia}},Монголын театр,Монголын барилга байгууламж

export type CsvRow = {
    name: string;
    interwiki?: {
        lang: string;
        name: string;
    };
    content: string;
    categories: string[];
    moveTo?: string;
    moveBoolean?: boolean;
};

export const interwikiParse = (data: string) =>
    new RegExp(".:.").test(data)
        ? {
              lang: data.split(":")[0],
              name: data.slice(data.indexOf(":") + 1),
          }
        : undefined;

export const readFromCsv = (FILE: string): CsvRow[] => {
    const arr = simpleReadFromCsv(FILE);
    const pages: CsvRow[] = [];
    arr.forEach((element) => {
        if (element.length > 1) {
            pages.push({
                name: element[0],
                interwiki: interwikiParse(element[1]),
                content: element[2] ?? "",
                categories: element.slice(3).filter((v) => v.length > 1) ?? [],
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
