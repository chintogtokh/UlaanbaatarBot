import { ApiParams, mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { format } from "date-fns";
import * as nodemailer from "nodemailer";
import { utcToZonedTime } from "date-fns-tz";

const getSpecial = async (type: string) => {
    const bot = new mwn(BotConfig);
    await bot.login();

    const params: ApiParams = {
        action: "query",
        format: "json",
        list: "querypage",
        qppage: type,
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
    if (total > 50) {
        return `
        <h3>${title}: ${total}</h3>
            `;
    }
    const middle =
        "<ul>" +
        listed
            .map(
                (val) =>
                    `<li><a href="https://mn.wikipedia.org/wiki/${val}">${val}</a></li>`
            )
            .join("") +
        "</ul>";
    return `
<h3>${title}: ${total}</h3>
${middle}
    `;
};

async function main() {
    let transporter = nodemailer.createTransport({
        debug: true,
        logger: true,
        host: "smtp.zoho.com.au",
        port: 465,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2",
        },
        auth: { user: "chintogtokh@zohomail.com.au", pass: "Ae7ck84LKnUU" },
    });

    const uncategorized = await getSpecial("Uncategorizedpages");
    const stats = await generateStats("Uncategorized pages", uncategorized);

    const wanted = await getSpecial("Wantedcategories");
    const wantedstats = await generateStats("Wanted Categories", wanted);

    const date = utcToZonedTime(
        new Date().toISOString(),
        "Australia/Melbourne"
    );

    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");

    // Message object
    let message = {
        from: "Chintogtokh Batbold <chintogtokh@zohomail.com.au>",
        to: "Chintogtokh Batbold <bchintogtokh@gmail.com>",
        subject: `✍️ Wikipedia Summary for ${formattedDate}`,
        html:
            `<p><b>Greetings</b><br />This is the Wikipedia Summary for 📘 ${formattedDate}` +
            "<p>" +
            stats +
            wantedstats +
            "</p>",
    };

    let info = await transporter.sendMail(message);
    console.log("Message sent successfully as %s", info.messageId);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
