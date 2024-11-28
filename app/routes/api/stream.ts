import invariant from "tiny-invariant";
import { AssistantResponse } from "ai";

import { ai } from "~/open-ai";
import { Route } from "./+types/stream";

export async function action({ request, params }: Route.ActionArgs) {
    const { assistantId, threadId } = params;
    invariant(assistantId, "Assistant ID is undefined");
    invariant(threadId, "Thread ID is undefined");

    try {
        const { message }: { message: string } = await request.json();

        invariant(message, "Message is undefined");

        const { id: messageId } = await ai.beta.threads.messages.create(
            threadId,
            {
                role: "user",
                content: message,
            },
        );

        // Create a readable stream to send chunks of data progressively
        return AssistantResponse(
            { threadId, messageId },
            // @ts-ignore
            async ({ forwardStream }) => {
                const runStream = ai.beta.threads.runs.stream(threadId, {
                    assistant_id:
                        assistantId ??
                        (() => {
                            throw new Error("assistantId is not set");
                        })(),
                });

                let runResult = await forwardStream(runStream);

                // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
                while (
                    runResult?.status === "requires_action" &&
                    runResult.required_action?.type === "submit_tool_outputs"
                ) {
                    const tool_outputs =
                        runResult.required_action.submit_tool_outputs.tool_calls.map(
                            (toolCall: any) => {
                                const parameters = JSON.parse(
                                    toolCall.function.arguments,
                                );

                                switch (toolCall.function.name) {
                                    // configure your tool calls here

                                    default:
                                        throw new Error(
                                            `Unknown tool call function: ${toolCall.function.name}`,
                                        );
                                }
                            },
                        );

                    runResult = await forwardStream(
                        ai.beta.threads.runs.submitToolOutputsStream(
                            threadId,
                            runResult.id,
                            { tool_outputs },
                        ),
                    );
                }
            },
        );
    } catch (error) {
        console.error("Error creating event stream:", error);
        return new Response("Error creating stream", { status: 500 });
    }
}
