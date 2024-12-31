import { defineField, defineType } from "sanity";

export const articleType = defineType({
    name: "article",
    title: "Article",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            },
            hidden: ({ document }) => !document?.title,
        }),
        defineField({
            description:
                "Content that will be made available to Open AI Assistants",
            title: "Markdown",
            name: "details",
            type: "array",
            of: [{ type: "block" }],
        }),
    ],
});
