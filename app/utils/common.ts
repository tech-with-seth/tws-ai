import {
    Message,
    TextContentBlock,
} from "openai/resources/beta/threads/messages.mjs";
import { getUniqueId } from "~/utils/string";
import { AppMessage } from "./types.server";
import { ChatCompletion } from "openai/resources/index.mjs";

export function shapeMessages(messages: Message[]): AppMessage[] {
    return messages.map((msg) => ({
        id: getUniqueId("msg"),
        role: msg.role,
        content: (msg.content.at(0) as TextContentBlock).text.value, // .text.value.replace(/【\d+:\d+†[^\]]+】/g, "")
    }));
}

export function handleCompletionResponse(response: ChatCompletion) {
    return response.choices.at(0)?.message.content;
}
