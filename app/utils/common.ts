import {
    Message,
    TextContentBlock,
} from "openai/resources/beta/threads/messages.mjs";
import { getUniqueId } from "~/utils/string";
import { AppMessage } from "./types.server";

export function shapeMessages(messages: Message[]): AppMessage[] {
    return messages.map((msg) => ({
        id: getUniqueId("msg"),
        role: msg.role,
        text: (msg.content.at(0) as TextContentBlock).text.value,
    }));
}
