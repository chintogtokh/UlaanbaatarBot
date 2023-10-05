import { mwn } from "mwn";

const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

export const renameCategory = async (
    bot: mwn,
    fromWithoutPrefix: string,
    toWithoutPrefix: string,
    moveOriginalOrNo: boolean = true
) => {
    const from = `Ангилал:${fromWithoutPrefix}`; //needa cat as well
    const to = `Ангилал:${toWithoutPrefix}`;
    console.log(`Processing: ${from} to ${to}`);

    const pages = await bot.getPagesInCategory(from);

    console.log(pages);

    const getEditedText = (content: string, category: string) => {
        const value = content
            .replace(
                new RegExp(`\\[\\[Ангилал:${category}\\]\\]`, "g"),
                `[[${to}]]`
            )
            .replace(
                new RegExp(`\\[\\[Ангилал:${category}\\|.*\\]\\]`, "g"),
                `[[${to}]]`
            )
            .replace(
                new RegExp(`\\[\\[Category:${category}\\]\\]`, "g"),
                `[[${to}]]`
            )
            .replace(
                new RegExp(`\\[\\[Category:${category}\\|.*\\]\\]`, "g"),
                `[[${to}]]`
            );
        return value;
    };

    for await (const element of pages) {
        console.log(element, `[[${from}]]-ийг [[${to}]]-аар сольж байна`);

        await bot.edit(element, (rev) => {
            return {
                text: getEditedText(rev.content, fromWithoutPrefix),
                summary: `[[${from}]]-ийг [[${to}]]-аар сольж байна`,
                minor: true,
            };
        });
        await new Promise((r) => setTimeout(r, 3000));
    }
    if (moveOriginalOrNo) {
        try {
            await bot.move(
                from,
                to,
                `[[${from}]]-ийг [[${to}]]-аар сольж байна`
            );
        } catch {
            console.log("skipping: " + from, to);
        }
    }
};

export const deleteCategory = async (bot: mwn, fromWithoutPrefix: string) => {
    const from = `Ангилал:${fromWithoutPrefix}`; //needa cat as well
    console.log(`Deleting: ${from}`);

    const pages = await bot.getPagesInCategory(from);

    const getReplacedText = (content: string, category: string) => {
        const value = content
            .replace(new RegExp(`\\[\\[Ангилал:${category}\\]\\]`, "g"), "")
            .replace(
                new RegExp(`\\[\\[Ангилал:${category}\\|.*\\]\\]`, "g"),
                ""
            )
            .replace(new RegExp(`\\[\\[Category:${category}\\]\\]`, "g"), "")
            .replace(
                new RegExp(`\\[\\[Category:${category}\\|.*\\]\\]`, "g"),
                ""
            );
        return value;
    };

    for await (const element of pages) {
        console.log(element, `[[${from}]]-г устгаж байна`);

        // test later, delete this comment
        await bot.edit(element, (rev) => {
            // console.log(getReplacedText(rev.content, fromWithoutPrefix));
            return {
                text: getReplacedText(rev.content, fromWithoutPrefix),
                summary: `[[${from}]]-г устгаж байна`,
                minor: true,
            };
        });
        await new Promise((r) => setTimeout(r, 3000));
    }
};
