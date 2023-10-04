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

    for await (const element of pages) {
        console.log(element, `[[${from}]]-ийг [[${to}]]-аар сольж байна`);

        // test later, delete this comment
        await bot.edit(element, (rev) => {
            let text = rev.content.replace(
                new RegExp(`\\\[\\\[${escapeRegExp(from)}`, "g"),
                `[[${to}`
            );

            if (toWithoutPrefix === "DELETE") {
                console.log("DELETE");
                text = rev.content.replace(
                    new RegExp(
                        `\\\[\\\[${escapeRegExp(from)}(|.*)?\\\]\\\]`,
                        "g"
                    ),
                    ""
                );
                console.log(text);
            }

            return {
                text: text,
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
