import { useEffect, useMemo, useState } from "react";
import {
    Link,
    Outlet,
    redirect,
    useFetcher,
    useNavigation,
} from "react-router";
import invariant from "tiny-invariant";
import { Field, Label } from "@headlessui/react";
import {
    LoaderPinwheelIcon,
    MessageCirclePlusIcon,
    TrashIcon,
} from "lucide-react";

import { Card } from "~/components/Card";
import { ComboBox } from "~/components/form/ComboBox";
import {
    createBareThread,
    createPrismaBareThread,
    getThreadsByUserId,
    updateThreadTitle,
} from "~/models/thread.server";
import { getUser, getUserId } from "~/utils/auth.server";
import {
    getPrismaAssistantByOpenId,
    getUsersAssistants,
} from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { Route } from "../dashboard/+types";
import { TextFormField } from "~/components/form/TextFormField";
import { createCompletion } from "~/models/completion.server";
import { Button } from "~/components/Button";
import { createMessage } from "~/models/message.server";
import { cache } from "~/utils/cache";
import { ellipsisify } from "~/utils/string";
import { ButtonLink } from "~/components/ButtonLink";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await getUser(request);
    const userId = user?.id;
    invariant(userId, "User ID is not defined");

    const assistantsResponse = await getUsersAssistants(userId);
    const assistants = assistantsResponse.map(
        ({ id, name, description, instructions }) => ({
            description,
            id, // oId
            instructions,
            name,
        }),
    );

    const threads = await getThreadsByUserId(userId);

    return {
        assistants,
        isAdmin: user?.role === "ADMIN",
        threads,
        user,
    };
}

// TODO: Improve caching - data is stale :(
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    if (cache.getKey("dashboardData")) {
        return cache.getKey("dashboardData") as Awaited<
            ReturnType<typeof serverLoader>
        >;
    } else {
        const freshDashboardData = await serverLoader();
        cache.set("dashboardData", freshDashboardData);
        cache.save();

        return freshDashboardData;
    }
}

clientLoader.hydrate = true;

export async function action({ request }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID does not exist");

    const form = await request.formData();
    // JANK: This is a workaround for the ComboBox component not returning the correct value
    const assistantId = String(form.get("assistantId-id"));
    invariant(assistantId, "Assistant ID does not exist");

    // JANK: Don't love it but it works
    const prismaAssistant = await getPrismaAssistantByOpenId(assistantId);
    invariant(prismaAssistant, "Prisma Assistant ID does not exist");

    const prompt = String(form.get("prompt"));
    invariant(prompt, "Prompt does not exist");

    const thread = await createBareThread();
    const prismaThread = await createPrismaBareThread(
        userId,
        thread.id,
        prismaAssistant.id,
    );

    await createMessage(thread.id, prompt);

    const completedThreadName = await createCompletion(prompt);
    const updatedThreadName =
        completedThreadName.choices.at(0)?.message.content;
    invariant(updatedThreadName, "updatedThreadName encountered an error");

    await updateThreadTitle(updatedThreadName, thread.id, prismaThread.id);

    return redirect(`${assistantId}/${thread.id}`);
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const currentHour = new Date().getHours();

    const timeOfDayGreeting = useMemo(() => {
        if (currentHour < 12) {
            return "Good morning";
        } else if (currentHour < 18) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    }, [currentHour]);

    const navigation = useNavigation();

    const getThreadIsLoading = (threadId: string) =>
        navigation && navigation.location?.pathname.includes(threadId);

    const newThreadFetcher = useFetcher();
    const isCreatingThread = newThreadFetcher.state !== "idle";

    const deleteThreadFetcher = useFetcher();
    const isDeletingThread = deleteThreadFetcher.state !== "idle";

    useEffect(() => {
        if (
            deleteThreadFetcher.data &&
            deleteThreadFetcher.data.message === "Deleted"
        ) {
            setShowDeleteConfirmation(null);
        }
    }, [deleteThreadFetcher.data]);

    const [chatPrompt, setChatPrompt] = useState("");
    const hasChatPrompt = chatPrompt.length > 0;

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);

    const hasAssistants =
        loaderData.assistants && loaderData.assistants.length > 0;

    return (
        <>
            <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto] gap-4">
                <div className="col-span-12 row-span-1 flex w-full flex-1 flex-col">
                    <div className="flex h-full flex-col items-center justify-center gap-8 p-4">
                        <Heading>{`${timeOfDayGreeting}${Boolean(loaderData.user.profile) && loaderData.user.profile ? `, ${loaderData.user.profile.firstName}.` : ". "} How can I help?`}</Heading>
                        {hasAssistants ? (
                            <newThreadFetcher.Form
                                method="POST"
                                className="flex w-full flex-col gap-4 rounded-xl border border-zinc-300 bg-zinc-200 p-4 md:max-w-[768px] dark:border-zinc-600 dark:bg-zinc-800"
                            >
                                <TextFormField
                                    className="min-h-11 w-full"
                                    helperText="What would you like to chat about?"
                                    id="prompt"
                                    label="Prompt"
                                    name="prompt"
                                    onChange={(event) =>
                                        setChatPrompt(event.target.value)
                                    }
                                />
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Field>
                                            <Label>Assistant</Label>
                                            <ComboBox
                                                id="assistantId"
                                                name="assistantId"
                                                options={loaderData.assistants.map(
                                                    (assistant) => ({
                                                        id: assistant.id,
                                                        label: assistant.name as string,
                                                    }),
                                                )}
                                            />
                                        </Field>
                                    </div>
                                    <Button
                                        className="self-end"
                                        iconBefore={
                                            isCreatingThread ? (
                                                <LoaderPinwheelIcon className="animate-spin" />
                                            ) : (
                                                <MessageCirclePlusIcon />
                                            )
                                        }
                                        disabled={!hasChatPrompt}
                                    >
                                        Start chat
                                    </Button>
                                </div>
                            </newThreadFetcher.Form>
                        ) : (
                            <Card className="flex flex-col gap-4 p-8 text-center">
                                <p>No assistants found.</p>
                                <ButtonLink to="/assistants/create">
                                    Create an assistant
                                </ButtonLink>
                            </Card>
                        )}
                    </div>
                </div>
                <div className="col-span-full p-4">
                    <Heading as="h4" className="mb-4 text-center">
                        Recent conversations
                    </Heading>
                    <div className="flex h-auto gap-4 overflow-x-auto">
                        {loaderData.threads && loaderData.threads.length > 0 ? (
                            loaderData.threads.map((thread) => (
                                <Card
                                    key={thread.id}
                                    className="relative flex min-h-32 min-w-[320px] flex-col justify-between gap-4 overflow-hidden"
                                >
                                    <div>
                                        <Link
                                            className="mb-4 inline-block underline"
                                            to={`${thread.assistant.oId}/${thread.id}`}
                                        >
                                            <Heading
                                                as="h3"
                                                className="text-lg"
                                            >
                                                {ellipsisify(thread.name, 30)}
                                            </Heading>
                                        </Link>
                                        <p>
                                            Chatting with:{" "}
                                            <span className="inline-block self-start rounded-xl border-primary-400 bg-primary-300 px-3 py-1 dark:border-primary-900 dark:bg-primary-700">
                                                {thread.assistant.name}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <div>
                                            <Button
                                                size="sm"
                                                color="danger"
                                                onClick={() =>
                                                    setShowDeleteConfirmation(
                                                        thread.id,
                                                    )
                                                }
                                                iconBefore={
                                                    <TrashIcon className="h-4 w-4" />
                                                }
                                            />
                                        </div>
                                        {getThreadIsLoading(thread.id) && (
                                            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-zinc-300/80 dark:bg-zinc-900/80">
                                                <LoaderPinwheelIcon className="animate-spin" />
                                            </div>
                                        )}
                                        {showDeleteConfirmation ===
                                            thread.id && (
                                            <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center gap-4 bg-zinc-300/95 dark:bg-zinc-900/95">
                                                <p>
                                                    Are you sure you want to
                                                    delete?
                                                </p>
                                                <div className="flex gap-4">
                                                    <deleteThreadFetcher.Form
                                                        method="DELETE"
                                                        action={`/api/threads/${thread.id}`}
                                                    >
                                                        <Button
                                                            color="danger"
                                                            className="mr-4"
                                                        >
                                                            {isDeletingThread ? (
                                                                <LoaderPinwheelIcon className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                `Yes, delete`
                                                            )}
                                                        </Button>
                                                    </deleteThreadFetcher.Form>
                                                    <Button
                                                        onClick={() =>
                                                            setShowDeleteConfirmation(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-8 text-center">
                                <p>
                                    <strong>No chats found.</strong>
                                    <br />
                                    Start a new one above ⬆️
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}
