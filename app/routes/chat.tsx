import { useEffect, useRef } from "react";
import { data, useFetcher, useNavigate, useParams } from "react-router";
import { useAssistant } from "ai/react";
import invariant from "tiny-invariant";

import { Drawer } from "~/components/Drawer";
import { Heading } from "~/components/Heading";
import { getThreadStream, Paths } from "~/utils/paths";
import useDrawer from "~/hooks/useDrawer";
import { Route } from "./+types/chat";
import TextField from "~/components/TextField";
import { Button } from "~/components/Button";
import { getThreadByOpenId, getThreadMessages } from "~/models/thread.server";
import { shapeMessages } from "~/utils/common";

export async function loader({ params }: Route.LoaderArgs) {
    const { threadId } = params;
    invariant(threadId, "Thread ID does not exist");

    const thread = await getThreadByOpenId(threadId);
    const hasName = Boolean(thread?.name);

    const messagesResponse = await getThreadMessages(threadId);
    const messageHistory = shapeMessages(messagesResponse.data);

    return data({
        thread,
        hasName,
        messageHistory,
    });
}

export default function Chat({ loaderData }: Route.ComponentProps) {
    const { thread, hasName, messageHistory } = loaderData;
    const { assistantId, threadId } = useParams();
    invariant(assistantId, "Assistant ID is undefined");
    invariant(threadId, "Thread ID is undefined");
    const navigate = useNavigate();
    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });
    const chatFetcher = useFetcher();
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
                    <Heading as="h3">Chat</Heading>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {JSON.stringify(messageHistory)}
                    {JSON.stringify(messages)}
                    <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-t-zinc-300 p-4 dark:border-t-zinc-600">
                    <chatFetcher.Form
                        method="POST"
                        action={""}
                        className="flex gap-2"
                        onSubmit={handleFormSubmit}
                    >
                        <TextField
                            className="flex-1"
                            onChange={handleInputChange}
                            value={input}
                        />
                        <Button>Send</Button>
                    </chatFetcher.Form>
                </div>
            </div>
        </Drawer>
    );
}
