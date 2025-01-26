import { logger, task, wait } from "@trigger.dev/sdk/v3";

import { client } from "../app/sanity-client";
import { blocksToText } from "~/utils/common";

export const documentUpdater = task({
    id: "document-updater",
    maxDuration: 60,
    run: async (payload: any, { ctx }) => {
        const articles = await client.fetch('*[_type == "article"]');
        const mappedArticles = articles.map(
            (article: { title: string; details: string }) => {
                return `#${article.title}
${blocksToText(article.details)}
---
`;
            },
        );

        // logger.log("Hello, world!", { payload, ctx });

        return {
            articles: mappedArticles,
        };
    },
});
