import { Schema, z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

import { ai } from "~/open-ai";

export const ThreadTitleSchema = z.object({
    title: z.string(),
});

export const SnippetSchema = z.object({
    prefix: z.string(), // The trigger text for the snippet
    body: z.union([
        z.array(z.string()), // Multi-line snippet body
        z.string(), // Single-line snippet body
    ]),
    description: z.string().optional(), // Optional description of the snippet
    scope: z.string().optional(), // Optional scope where the snippet applies (e.g., "javascript" or "typescript")
});

export const CompanySchema = z.object({
    name: z.string(),
    description: z.string(),
});

export const AssistantSchema = z.object({
    name: z.string(),
    instructions: z.string(),
    model: z.string(),
});

export function createCompletion(
    content: string,
    responseConfig?: {
        schema: Schema;
        schemaTitle: string;
    },
) {
    const format = responseConfig
        ? {
              response_format: zodResponseFormat(
                  responseConfig.schema,
                  responseConfig.schemaTitle,
              ),
          }
        : {};

    return ai.chat.completions.create({
        messages: [
            {
                role: "user",
                content,
            },
        ],
        model: "gpt-4o",
        ...format,
    });
}
