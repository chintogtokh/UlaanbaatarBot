import { ApiParams, mwn } from "mwn";
import { BotConfig } from "../../utils/bot";

const existingPages = ["International"];
const placeNewPagesIn = "OtherNew";

const main = async () => {
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
    const rawList = data?.query?.querypage.results?.map(
        (result: any) => result.title
    );
    console.log(rawList);
};

main();
