import { task } from "@trigger.dev/sdk/v3";

import { client } from "../app/sanity-client";
import { blocksToText } from "~/utils/common";
import { upsertArticle } from "~/models/article.server";
import { createFileAndAddToVectorStore } from "~/models/file.server";

export const documentUpdater = task({
    id: "document-updater",
    maxDuration: 60,
    run: async () => {
        const articles = await client.fetch('*[_type == "article"]');
        const mappedArticles = articles.map(
            (article: { title: string; details: string }) => {
                return `#${article.title}
${blocksToText(article.details)}
---`;
            },
        );

        try {
            await Promise.all(
                articles.map((article: any) =>
                    upsertArticle(
                        article._id,
                        article.title,
                        blocksToText(article.details),
                    ),
                ),
            );
        } catch (e) {
            console.error("Error updating articles");
            console.error(e);
        }

        try {
            await createFileAndAddToVectorStore({
                assistantId: "asst_l3AAo6dmGvu0ABow1VLuQZoZ",
                content: mappedArticles.join("\n"),
                fileName: "sanity-articles",
            });
        } catch (e) {
            console.error("Error creating file and adding to vector store");
            console.error(e);
        }

        // logger.log("Hello, world!", { payload, ctx });

        return {
            articles: mappedArticles,
        };
    },
});
