import { ai } from "~/open-ai";

export function createMessage(
    threadId: string,
    content: string,
    metadata?: unknown,
) {
    return ai.beta.threads.messages.create(threadId, {
        role: "user",
        content,
        metadata,
    });
}
