import { useEffect, useRef, useState } from "react";
import {
    Outlet,
    useFetcher,
    useLocation,
    useNavigate,
    useNavigation,
} from "react-router";
import invariant from "tiny-invariant";
import {
    BotIcon,
    FileIcon,
    FileQuestion,
    ListIcon,
    LoaderPinwheelIcon,
    MessagesSquareIcon,
    PencilIcon,
    SendHorizonalIcon,
    SparkleIcon,
    TrashIcon,
} from "lucide-react";

import { Banner } from "~/components/Banner";
import { Button } from "~/components/Button";
import { ButtonLink } from "~/components/ButtonLink";
import { Card } from "~/components/Card";
import { getThreadsByUserId } from "~/models/thread.server";
import { getUserId } from "~/utils/auth.server";
import { getUsersAssistants } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Paths } from "~/utils/paths";
import { Route } from "./+types/dashboard";
import { useDrawer } from "~/hooks/useDrawer";
import { Drawer } from "~/components/Drawer";
import { TextField } from "~/components/form/TextField";

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID is not defined");

    const assistantsResponse = await getUsersAssistants(userId);
    const assistants = assistantsResponse.map(
        ({ id, name, description, instructions }) => ({
            description,
            id,
            instructions,
            name,
        }),
    );

    const threads = await getThreadsByUserId(userId);

    return {
        assistants,
        threads,
    };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { assistants, threads } = loaderData;
    const navigation = useNavigation();

    const newThreadFetcher = useFetcher();
    const promptRef = useRef<HTMLInputElement>(null);

    const deleteThreadFetcher = useFetcher();
    const getDeleteChatIcon = (threadId: string) =>
        deleteThreadFetcher.state !== "idle" &&
        deleteThreadFetcher.formAction?.includes(threadId) ? (
            <LoaderPinwheelIcon className="animate-spin" />
        ) : (
            <TrashIcon />
        );

    const location = useLocation();
    const [targetAssistantId, setTargetAssistantId] = useState<string>("");
    const isNotOnChatRoute = !location.pathname.includes("chat");

    const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer({
        openOnRender: false,
    });

    useEffect(() => {
        if (isDrawerOpen) {
            promptRef.current?.focus();
        }
    }, [isDrawerOpen]);

    useEffect(() => {
        return () => {
            setTargetAssistantId("");
        };
    }, []);

    return (
        <>
            <div className="px-4">
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_ASSISTANT}
                        color="secondary"
                    >
                        <PencilIcon className="h-5 w-5" />
                        Create assistant
                    </ButtonLink>
                </div>
                <div className="grid gap-3 md:grid-cols-12">
                    {assistants && assistants.length > 0 ? (
                        assistants.map(
                            ({ id, name, description, instructions }) => (
                                <Card
                                    key={id}
                                    className="col-span-1 flex h-full flex-col justify-between md:col-span-6 lg:col-span-4 xl:col-span-3"
                                >
                                    <div>
                                        <Heading as="h4">{name}</Heading>
                                        {description && <p>{description}</p>}
                                        <p className="mb-4">{instructions}</p>
                                    </div>
                                    <div className="inline-flex gap-2 self-end">
                                        <ButtonLink
                                            className="inline-flex items-center gap-1"
                                            to={`/${id}`}
                                            size="sm"
                                            variant="outline"
                                            color="secondary"
                                        >
                                            <ListIcon className="h-4 w-4" />
                                            <span className="inline-block">
                                                Details
                                            </span>
                                        </ButtonLink>
                                        <ButtonLink
                                            className="inline-flex items-center gap-1"
                                            to={`${id}/create-file`}
                                            size="sm"
                                            variant="outline"
                                            color="secondary"
                                        >
                                            <FileIcon className="h-4 w-4" />
                                            <span className="inline-block">
                                                Add file
                                            </span>
                                        </ButtonLink>
                                        <Button
                                            className="inline-flex items-center gap-1"
                                            size="sm"
                                            color="secondary"
                                            onClick={() => {
                                                setTargetAssistantId(id);
                                                openDrawer();
                                            }}
                                            iconBefore={
                                                <SparkleIcon className="h-5 w-5" />
                                            }
                                        >
                                            New thread
                                        </Button>
                                    </div>
                                </Card>
                            ),
                        )
                    ) : (
                        <Banner
                            icon={<FileQuestion className="h-6 w-6" />}
                            className="min-w-[200px] basis-1/4"
                            variant="warning"
                        >
                            No assistants available
                        </Banner>
                    )}
                </div>
                <HorizontalRule space="lg" />
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Threads</Heading>
                </div>
                <div className="grid gap-3 md:grid-cols-12">
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <Card
                                key={thread.id}
                                className="col-span-1 flex h-full flex-col justify-between md:col-span-6 lg:col-span-4 xl:col-span-3"
                            >
                                <div>
                                    <Heading as="h4">
                                        {thread.name ?? "Untitled"}
                                    </Heading>
                                    <p className="mb-4 mt-2">
                                        Chatting with:{" "}
                                        <span className="inline-block rounded-xl bg-black px-2 py-1 text-white dark:bg-black dark:text-white">
                                            {thread.assistant.name}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <deleteThreadFetcher.Form
                                        method="DELETE"
                                        action={`${Paths.API_THREADS}/${thread.id}`}
                                    >
                                        <Button
                                            className="inline-flex items-center gap-2 self-end"
                                            size="sm"
                                            color="danger"
                                            type="submit"
                                            iconBefore={getDeleteChatIcon(
                                                thread.id,
                                            )}
                                            disabled={
                                                deleteThreadFetcher.state !==
                                                "idle"
                                            }
                                        >
                                            Delete chat
                                        </Button>
                                    </deleteThreadFetcher.Form>
                                    <ButtonLink
                                        className="inline-flex items-center gap-2 self-end"
                                        to={`/dashboard/chat/${thread.slug}`}
                                        size="sm"
                                        color="secondary"
                                    >
                                        {navigation.state !== "idle" &&
                                        navigation.location.pathname.includes(
                                            thread.slug,
                                        ) ? (
                                            <LoaderPinwheelIcon className="animate-spin" />
                                        ) : (
                                            <MessagesSquareIcon />
                                        )}{" "}
                                        Open chat
                                    </ButtonLink>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Banner
                            icon={<FileQuestion className="h-6 w-6" />}
                            className="min-w-[200px] basis-1/4"
                            variant="warning"
                        >
                            No threads available
                        </Banner>
                    )}
                </div>
            </div>
            <Outlet />
            {isNotOnChatRoute && (
                <Drawer
                    handleClose={() => {
                        setTargetAssistantId("");
                        closeDrawer();
                    }}
                    id="newThreadDrawer"
                    isOpen={isDrawerOpen}
                    position="right"
                    size="md"
                >
                    <div className="flex h-full flex-col">
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-4">
                            <div className="text-center">
                                <BotIcon className="h-24 w-24 text-zinc-300 dark:text-zinc-600" />
                                <p className="text-zinc-300 dark:text-zinc-600">
                                    Let's chat!
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-t-zinc-300 p-4 dark:border-t-zinc-600">
                            <newThreadFetcher.Form
                                className="flex gap-2"
                                method="POST"
                                action="/api/threads"
                            >
                                <input
                                    type="hidden"
                                    name="assistantId"
                                    value={targetAssistantId}
                                />
                                <TextField
                                    autoComplete="off"
                                    className="flex-1"
                                    name="prompt"
                                    placeholder={
                                        targetAssistantId
                                            ? `What do you want to say to ${assistants.find((assistant) => assistant.id === targetAssistantId)?.name}?`
                                            : "What would you like to say?"
                                    }
                                    ref={promptRef}
                                />
                                <Button
                                    className="flex gap-2"
                                    iconAfter={<SendHorizonalIcon />}
                                    name="intent"
                                    value="newThread"
                                >
                                    Send
                                </Button>
                            </newThreadFetcher.Form>
                        </div>
                    </div>
                </Drawer>
            )}
        </>
    );
}
