import { ApiParams, mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { format } from "date-fns";
import * as nodemailer from "nodemailer";

const getUncategorized = async () => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const params: ApiParams = {
        action: "query",
        format: "json",
        list: "querypage",
        qppage: "Uncategorizedpages",
        qplimit: 500,
    };

    const data = await bot.query(params);
    const rawList: string[] = data?.query?.querypage.results?.map(
        (result: any) => result.title
    );
    return rawList;
};

const generateStats = (title: string, listed: string[]) => {
    const total = listed.length;
    const middle = `<ul>${listed.map((val) => "<li>" + val + "</li>")}</ul>`;
    return `
<h1>${title}: ${total}</h1>
${middle}
    `;
};

async function main() {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        // sendmail: true,
        // newline: "windows",
        debug: true,
        logger: true,
        host: "smtp.zoho.com.au",
        port: 465,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2",
        },
        // secure: true,
        auth: { user: "chintogtokh@zohomail.com.au", pass: "Ae7ck84LKnUU" },
    });

    const uncategorized = ["a"]; // await getUncategorized();
    const stats = await generateStats("Uncategorized pages", uncategorized);

    // Message object
    let message = {
        from: "Chintogtokh Batbold <chintogtokh@zohomail.com.au>",
        to: "Chintogtokh Batbold <bchintogtokh@gmail.com>",
        subject: `Wikipedia Summary for 📘 ${format(new Date(), "PPPppp")}`,
        html:
            `<p><b>Greetings</b>, these is the Wikipedia Summary for 📘 ${format(
                new Date(),
                "PPPppp"
            )}</p>` +
            "<p>" +
            stats +
            "</p>",
    };

    let info = await transporter.sendMail(message);
    console.log("Message sent successfully as %s", info.messageId);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
