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
        content: (msg.content.at(0) as TextContentBlock).text.value.replace(
            /【\d+:\d+†[^\]]+】/g,
            "",
        ),
    }));
}

export function handleCompletionResponse(response: ChatCompletion) {
    return response.choices.at(0)?.message.content;
}

export function blocksToText(blocks: any, opts = {}) {
    const options = Object.assign({}, { nonTextBehavior: "remove" }, opts);
    return blocks
        .map((block: any) => {
            if (block._type !== "block" || !block.children) {
                return options.nonTextBehavior === "remove"
                    ? ""
                    : `[${block._type} block]`;
            }

            return block.children.map((child: any) => child.text).join("");
        })
        .join("\n\n");
}

export function extractFunctionsData(response: ChatCompletion) {
    const toolCalls = response.choices[0]?.message?.tool_calls || [];

    return toolCalls.map((toolCall) => {
        const { name, arguments: args } = toolCall.function;

        let parsedArgs: Record<string, any> = {};
        try {
            parsedArgs = JSON.parse(args); // Parse JSON arguments
        } catch (error) {
            console.error(
                `Failed to parse arguments for function ${name}:`,
                error,
            );
        }

        return {
            name,
            parameters: parsedArgs,
        };
    });
}
