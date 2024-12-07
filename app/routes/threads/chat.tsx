import { data, useFetcher, useParams } from "react-router";
import { SendHorizonalIcon } from "lucide-react";
import { useAssistant } from "ai/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import Markdown from "react-markdown";

import { Button } from "~/components/Button";
import { getThreadBySlug, getThreadMessages } from "~/models/thread.server";
import { getThreadStream, Paths } from "~/utils/paths";
import { Heading } from "~/components/Heading";
import { Message } from "~/components/Message";
import { shapeMessages } from "~/utils/common";
import { TextField } from "~/components/form/TextField";
import { Route } from "./+types/chat";
import { createRun } from "~/models/runs.server";

export async function loader({ params }: Route.LoaderArgs) {
    const { chatSlug } = params;
    invariant(chatSlug, "Chat slug does not exist");

    const thread = await getThreadBySlug(chatSlug);
    invariant(thread, "Thread does not exist");

    await createRun(thread.oId, thread.assistant.oId);

    const hasName = Boolean(thread?.name);

    const messagesResponse = await getThreadMessages(thread.oId);
    const messageHistory = shapeMessages(messagesResponse.data);

    return data({
        assistant: thread.assistant,
        hasName,
        messageHistory,
        thread,
    });
}

export default function Chat({ loaderData }: Route.ComponentProps) {
    const { assistant, thread, hasName, messageHistory } = loaderData;
    const threadNameFetcher = useFetcher();

    const messageFieldRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        messageFieldRef.current?.focus();
    }, []);

    const {
        // append,
        // error,
        handleInputChange,
        input,
        messages,
        status,
        submitMessage,
    } = useAssistant({
        api: getThreadStream(thread.assistant.oId, thread.oId),
        threadId: thread.oId,
    });
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const isInProgress = status === "in_progress";

    const handleFormSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        // if (!hasName) {
        //     const form = formEvent.currentTarget;
        //     const messageInput = form.elements.namedItem(
        //         "message",
        //     ) as HTMLInputElement;

        //     threadNameFetcher.submit(
        //         {
        //             threadId: String(thread.oId),
        //             prismaThreadId: String(thread?.id),
        //             name: messageInput
        //                 ? String(messageInput.value)
        //                 : "A new thread",
        //         },
        //         { action: Paths.API_THREADS, method: "PUT" },
        //     );
        // }

        submitMessage(formEvent);
    };

    const combinedMessage = [...messageHistory, ...messages];

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="border-b border-b-zinc-300 p-4 dark:border-b-zinc-600">
                    <Heading as="h3">
                        <span className="block text-sm text-zinc-300 dark:text-zinc-400">
                            Chatting with {assistant.name}
                        </span>
                        {thread?.name}
                    </Heading>
                </div>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                    {combinedMessage.map((m) => (
                        <Message key={m.id} role={m.role}>
                            <Markdown>{m.content}</Markdown>
                        </Message>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-t-zinc-300 p-4 dark:border-t-zinc-600">
                    <form className="flex gap-2" onSubmit={handleFormSubmit}>
                        <TextField
                            autoComplete="off"
                            className="flex-1"
                            name="message"
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            ref={messageFieldRef}
                            value={input}
                        />
                        <Button
                            className="flex gap-2"
                            iconAfter={<SendHorizonalIcon />}
                            disabled={isInProgress}
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
