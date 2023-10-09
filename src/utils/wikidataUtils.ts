import { ApiParams, mwn } from "mwn";

export type WikibaseEntity = {
    entities: {
        [key: string]: {
            pageid: number;
            title: string;
            sitelinks: any;
        };
    };
    success: boolean;
};

export const getWikidataIdsGeneric = async (
    bot: mwn,
    lang1: string,
    pageName1: string,
    lang2: string,
    pageName2: string
) => {
    console.log("TRY MERGE");

    const paramsFetch1: ApiParams = {
        action: "wbgetentities",
        sites: `${lang1}wiki`,
        titles: pageName1,
    };

    const paramsFetch2: ApiParams = {
        action: "wbgetentities",
        sites: `${lang2}wiki`,
        titles: pageName2,
    };

    const result1 = (await bot
        .query(paramsFetch1)
        .catch((e: any) =>
            console.log("Error occured: ", e)
        )) as WikibaseEntity;
    const keys = Object.keys(result1?.entities);

    console.log(keys);

    if (keys.length === 1) {
        console.log("Can merge");
        const wikidataId1 = keys[0];

        const result2 = (await bot
            .query(paramsFetch2)
            .catch((e: any) =>
                console.log("Error occured: ", e)
            )) as WikibaseEntity;
        const wikidataId2 = Object.keys(result2?.entities)[0];

        const ret = { lang1, wikidataId1, lang2, wikidataId2 };
        console.log("ret", ret);
        return ret;
    }
    return false;
};

export const connectMnToEn = async (
    bot: mwn,
    pageNameMn: string,
    pageNameEn: string
) => await connectArticles(bot, "en", pageNameEn, "mn", pageNameMn);

export const connectArticles = async (
    bot: mwn,
    lang1: string,
    pageName1: string,
    lang2: string,
    pageName2: string
) => {
    await bot.getTokens();

    const token = await bot.getCsrfToken();

    const params: ApiParams = {
        action: "wblinktitles",
        fromsite: `${lang1}wiki`,
        fromtitle: pageName1,
        tosite: `${lang2}wiki`,
        totitle: pageName2,
        token,
    };

    const result = await bot.query(params).catch(async (e: any) => {
        console.log("Error occured, try merging: ", e);
        const wikiDataIds = await getWikidataIdsGeneric(
            bot,
            lang1,
            pageName1,
            lang2,
            pageName2
        );
        if (wikiDataIds) {
            const mergeParams: ApiParams = {
                action: "wbmergeitems",
                fromid: wikiDataIds.wikidataId1,
                toid: wikiDataIds.wikidataId2,
                token: token,
            };
            const nextResult = await bot.query(mergeParams);
            console.log(nextResult);
        } else {
            console.log("Not mergeable");
        }
    });
};

export type LangLinkType = { lang: string; title: string };

export const getInterwiki = async (bot: mwn, pageName: string) => {
    const params: ApiParams = {
        action: "query",
        prop: "langlinks",
        titles: pageName,
        format: "json",
        lllimit: 500,
    };
    const res = await bot
        .query(params)
        .catch((e: any) => console.log("Error occured: ", e));
    const langlinks: LangLinkType[] = res && res?.query?.pages?.[0].langlinks;

    if (!langlinks) return null;

    let retlink = langlinks[0];

    const enLink = langlinks.filter((link) => link.lang === "en")?.[0];
    const deLink = langlinks.filter((link) => link.lang === "de")?.[0];
    const ruLink = langlinks.filter((link) => link.lang === "ru")?.[0];

    if (enLink) {
        retlink = enLink;
    } else if (deLink) {
        retlink = deLink;
    } else if (ruLink) {
        retlink = ruLink;
    }

    return `${retlink.lang}:${retlink.title}`;
};
