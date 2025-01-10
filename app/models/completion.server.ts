import { Schema, z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

import { ai } from "~/open-ai";
import { ChatCompletionTool } from "openai/src/resources/chat/completions.js";

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
            { role: "developer", content: "You are a helpful assistant." },
            {
                role: "user",
                content,
            },
        ],
        model: "gpt-4o",
        ...format,
    });
}

export function createToolCompletion(
    prompt: string,
    tools: ChatCompletionTool[],
) {
    return ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "developer", content: "You are a helpful assistant." },
            {
                role: "user",
                content: prompt,
            },
        ],
        tools,
    });
}
