import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

import { ai } from "~/open-ai";

const ThreadTitle = z.object({
    title: z.string(),
});

export function createCompletion(
    content: string,
    response_format = zodResponseFormat(ThreadTitle, "threadTitle"),
) {
    return ai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a thread expert. Take the initial question or topic and turn it into a title for the thread. Keep it short. Max length 8 words.`,
            },
            {
                role: "assistant",
                content: "What can I help you with?",
            },
            {
                role: "user",
                content,
            },
        ],
        model: "gpt-4o",
        response_format,
    });
}
