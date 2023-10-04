import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import * as fs from "fs";
import { CsvRow, interwikiParse } from "./csv";

const GOOGLE_SPREADSHEET = "1joX9r-2ycIuMTfmsq1VxEyeUy-wzk0TlhfxYm1dbrkQ";

export const loadSheet = async (sheetName: string) => {
    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET);
    const config = JSON.parse(
        fs.readFileSync("./googleconfig.json").toString()
    );
    await doc.useServiceAccountAuth(config);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[sheetName];
    return sheet;
};

// Skips
export const loadSheetRows = async (sheetName: string) => {
    const sheet = await loadSheet(sheetName);
    const rows = await sheet.getRows();

    const toret: { csvRow?: CsvRow; goog?: GoogleSpreadsheetRow }[] = [];

    for await (const element of rows) {
        if (element["skip"]) {
            console.log("Skipping: ", element["name"]);
            continue;
        }
        const categoryIdx = sheet.headerValues.indexOf("categories1");
        const allCats = element._rawData.slice(categoryIdx); // Categories start from column 3
        toret.push({
            csvRow: {
                name: element["name"],
                content: element["content"] || "",
                interwiki: interwikiParse(element["interwiki"]),
                categories: allCats,
                moveTo: element["moveTo"],
                moveBoolean: !!element["moveBoolean"],
            },
            goog: element,
        });
    }
    return toret;
};
