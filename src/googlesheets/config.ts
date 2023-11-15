import { Response } from 'express';
import { createCats, csvCat, deleteCats, deletePages, fetchArticles, fetchCats, fetchData, insertInterwiki, movePage, renameCats, replaceCats, translateCats, unlinkPages } from '.';

export type ConfigType = typeof Config;

const Config = {
    createCats: {
        script: () => createCats(),
        sheetName: "CreateCats",
        summary: "Ангилал үүсгэж байна",
    },
    csvCat: {
        script: () => csvCat(),
        sheetName: "CsvCat",
        summary: "Ангилал нэмж байна",
    },
    deleteCats: {
        script: () => deleteCats(),
        sheetName: "DeleteCats",
    },
    deletePages: {
        script: () => deletePages(),
        sheetName: "DeletePages",
    },
    fetchArticles: {
        script: () => fetchArticles(),
        sheetName: "FetchArticles",
    },
    fetchCats: {
        script: () => fetchCats(),
        sheetName: "FetchCats",
    },
    fetchData: {
        script: () => fetchData(),
        sheetName: "FetchData",
    },
    insertInterwiki: {
        script: () => insertInterwiki(),
        sheetName: "InsertInterwiki",
    },
    movePage: {
        script: () => movePage(),
        sheetName: "InsertInterwiki",
    },
    renameCats: {
        script: () => renameCats(),
        sheetName: "RenameCats",
    },
    replaceCats: {
        script: () => replaceCats(),
        sheetName: "ReplaceCats",
        summary: "Ангилал шинэчилж байна",
    },
    translateCats: {
        script: () => translateCats(),
        sheetName: "TranslateCats",
        langs: ["en", "ru", "de"],
    },
    unlinkPages: {
        script: () => unlinkPages(),
        sheetName: "UnlinkPages",
    },
};

export default Config;
