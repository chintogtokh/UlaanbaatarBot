const { GoogleSpreadsheet } = require('google-spreadsheet');
import * as fs from 'fs';
import { GoogleSpreadsheetRow } from 'google-spreadsheet';

const main = async () => {
    const doc = new GoogleSpreadsheet('1joX9r-2ycIuMTfmsq1VxEyeUy-wzk0TlhfxYm1dbrkQ');
    const config = JSON.parse(fs.readFileSync('src/projects/googleSheets/config.json').toString())
    await doc.useServiceAccountAuth(config);

    await doc.loadInfo();
    console.log(doc.title);

    const sheet = doc.sheetsByTitle['newest']
    const rows = await sheet.getRows();
    rows.forEach((element: GoogleSpreadsheetRow) => {
        console.log(element['Nationality'].split("\n"))
    });
}

main();