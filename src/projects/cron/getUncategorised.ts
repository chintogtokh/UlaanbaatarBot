// import { ApiParams, mwn } from "mwn";
// import { BotConfig } from "../../utils/bot";

// const existingPages = ["International"];
// const placeNewPagesIn = "OtherNew";

// const main = async () => {
//     const bot = new mwn(BotConfig);
//     await bot.login();

//     const params: ApiParams = {
//         action: "query",
//         format: "json",
//         list: "querypage",
//         qppage: "Uncategorizedpages",
//         qplimit: 500,
//     };

//     const data = await bot.query(params);
//     const rawList = data?.query?.querypage.results?.map(
//         (result: any) => result.title
//     );
//     console.log(rawList);
// };

// main();

/* eslint no-console: 0 */
import * as nodemailer from "nodemailer";

async function main() {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        // sendmail: true,
        // newline: "windows",
        logger: true,
        host: "smtp.zoho.com.au",
        port: 465,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2",
        },
        auth: { user: "chintogtokh@zohomail.com.au", pass: "KAD6nvhXGfKv" },
    });

    // Message object
    let message = {
        from: "Chintogtokh Batbold <chintogtokh@zohomail.com.au>",

        // Comma separated list of recipients
        to: "Chintogtokh Batbold <bchintogtokh@gmail.com>",

        // Subject of the message
        subject: "Nodemailer is unicode friendly ✔",

        // plaintext body
        text: "Hello to myself!",

        // HTML body
        html:
            '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
            '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

        // An array of attachments
        attachments: [
            // String attachment
            {
                filename: "notes.txt",
                content: "Some notes about this e-mail",
                contentType: "text/plain", // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: "image.png",
                content: Buffer.from(
                    "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/" +
                        "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U" +
                        "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
                    "base64"
                ),

                cid: "note@example.com", // should be as unique as possible
            },

            // File Stream attachment
            // {
            //     filename: "nyan cat ✔.gif",
            //     path: __dirname + "/assets/nyan.gif",
            //     cid: "nyan@example.com", // should be as unique as possible
            // },
        ],
    };

    let info = await transporter.sendMail(message);
    console.log("Message sent successfully as %s", info.messageId);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
