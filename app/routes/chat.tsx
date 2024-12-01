import { useEffect, useRef } from "react";
import { data, useFetcher, useNavigate, useParams } from "react-router";
import { useAssistant } from "ai/react";
import invariant from "tiny-invariant";
import Markdown from "react-markdown";

import { Drawer } from "~/components/Drawer";
import { Heading } from "~/components/Heading";
import { getThreadStream, Paths } from "~/utils/paths";
import useDrawer from "~/hooks/useDrawer";
import { Route } from "./+types/chat";
import TextField from "~/components/TextField";
import { Button } from "~/components/Button";
import { getThreadByOpenId, getThreadMessages } from "~/models/thread.server";
import { shapeMessages } from "~/utils/common";
import { getAssistant } from "~/models/assistant.server";
import { Message } from "~/components/Message";

export async function loader({ params }: Route.LoaderArgs) {
    const { assistantId, threadId } = params;
    invariant(threadId, "Thread ID does not exist");

    const assistant = await getAssistant(assistantId);

    const thread = await getThreadByOpenId(threadId);
    const hasName = Boolean(thread?.name);

    const messagesResponse = await getThreadMessages(threadId);
    const messageHistory = shapeMessages(messagesResponse.data);

    return data({
        assistant,
        hasName,
        messageHistory,
        thread,
    });
}

export default function Chat({ loaderData }: Route.ComponentProps) {
    const { assistant, thread, hasName, messageHistory } = loaderData;
    const { assistantId, threadId } = useParams();
    invariant(assistantId, "Assistant ID is undefined");
    invariant(threadId, "Thread ID is undefined");

    const navigate = useNavigate();
    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });

    const threadNameFetcher = useFetcher();

    const { status, messages, input, submitMessage, handleInputChange, error } =
        useAssistant({
            api: getThreadStream(assistantId, threadId),
            threadId,
        });

    const handleFormSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
        if (!hasName) {
            const form = formEvent.currentTarget;
            const messageInput = form.elements.namedItem(
                "message",
            ) as HTMLInputElement;

            threadNameFetcher.submit(
                {
                    threadId: String(threadId),
                    prismaThreadId: String(thread?.id),
                    name: messageInput
                        ? String(messageInput.value)
                        : "A new thread",
                },
                { action: Paths.API_THREADS, method: "PUT" },
            );
        }

        submitMessage(formEvent);
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const isInProgress = status === "in_progress";

    return (
        <Drawer
            handleClose={closeDrawer}
            id="createChat"
            isOpen={isDrawerOpen}
            position="right"
            size="md"
        >
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
                    {messageHistory.map((m) => (
                        <Message key={m.id} role={m.role}>
                            <Markdown>{m.text}</Markdown>
                        </Message>
                    ))}
                    {messages.map((m) => (
                        <Message key={m.id} role={m.role}>
                            <Markdown className={`animate-in fade-in`}>
                                {m.content}
                            </Markdown>
                        </Message>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-t-zinc-300 p-4 dark:border-t-zinc-600">
                    <form className="flex gap-2" onSubmit={handleFormSubmit}>
                        <TextField
                            className="flex-1"
                            onChange={handleInputChange}
                            value={input}
                            placeholder="Type a message..."
                        />
                        <Button disabled={isInProgress}>Send</Button>
                    </form>
                </div>
            </div>
        </Drawer>
    );
}
