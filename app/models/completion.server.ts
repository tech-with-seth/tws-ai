import { ChatCompletionTool } from "openai/src/resources/chat/completions.js";
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { Schema } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

import { ai } from "~/open-ai";

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

interface MagicToolConfig {
    maxSteps?: number;
    prompt: string;
    system: string;
    tools: Record<string, ReturnType<typeof tool>>;
}

// TODO: Fix "tools" types
export function magicToolCompletion({
    maxSteps = 5,
    prompt,
    system,
    tools,
}: MagicToolConfig) {
    return generateText({
        maxSteps,
        model: openai("gpt-4o-2024-08-06", { structuredOutputs: true }),
        prompt,
        system,
        tools,
    });
}
