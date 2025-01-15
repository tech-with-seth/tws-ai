import { useState } from "react";
import {
    Link,
    Outlet,
    redirect,
    useFetcher,
    useNavigation,
} from "react-router";
import invariant from "tiny-invariant";
import { Field, Label } from "@headlessui/react";
import { LoaderPinwheelIcon, MessageCirclePlusIcon } from "lucide-react";

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
    const { assistants, threads } = loaderData;
    const timeOfDayGreeting = `Good morning`;
    const navigation = useNavigation();

    const getThreadIsLoading = (threadId: string) =>
        navigation && navigation.location?.pathname.includes(threadId);

    const newThreadFetcher = useFetcher();

    const isCreatingThread = newThreadFetcher.state !== "idle";

    const [chatPrompt, setChatPrompt] = useState("");
    const hasChatPrompt = chatPrompt.length > 0;

    return (
        <>
            <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto] gap-4">
                <div className="col-span-12 row-span-1 flex w-full flex-1 flex-col">
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                        <Heading>{`${timeOfDayGreeting}, ${loaderData.user.profile?.firstName}. How can I help?`}</Heading>
                        <newThreadFetcher.Form
                            method="POST"
                            className="flex min-w-[768px] flex-col gap-4 rounded-xl border border-zinc-300 bg-zinc-200 p-4 dark:border-zinc-600 dark:bg-zinc-800"
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
                                            options={assistants.map(
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
                    </div>
                </div>
                <div className="col-span-full p-4">
                    <Heading as="h4" className="mb-4 text-center">
                        Recent conversations
                    </Heading>
                    <div className="flex gap-4 overflow-x-auto">
                        {threads.map((thread) => (
                            <Link
                                key={thread.id}
                                to={`${thread.assistant.oId}/${thread.id}`}
                            >
                                <Card
                                    key={thread.id}
                                    className="relative flex h-full min-w-[320px] flex-col justify-between gap-4 overflow-hidden"
                                >
                                    <p>{thread.name}</p>
                                    <p>
                                        Chatting with:{" "}
                                        <span className="inline-block self-start rounded-xl border-primary-400 bg-primary-300 px-3 py-1 dark:border-primary-900 dark:bg-primary-700">
                                            {thread.assistant.name}
                                        </span>
                                    </p>
                                    {getThreadIsLoading(thread.id) && (
                                        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-zinc-300/80 dark:bg-zinc-900/80">
                                            <LoaderPinwheelIcon className="animate-spin" />
                                        </div>
                                    )}
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    );
}
