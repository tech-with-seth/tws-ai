import { Form, Link, Outlet, useNavigation } from "react-router";
import invariant from "tiny-invariant";

import { Card } from "~/components/Card";
import { ComboBox } from "~/components/form/ComboBox";
import { getThreadsByUserId } from "~/models/thread.server";
import { getUser } from "~/utils/auth.server";
import { getUsersAssistants } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { Route } from "../dashboard/+types";
import { TextFormField } from "~/components/form/TextFormField";
import { Field, Label } from "@headlessui/react";
import { LoaderPinwheelIcon } from "lucide-react";

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

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { assistants, threads } = loaderData;
    const timeOfDayGreeting = `Good morning`;
    const navigation = useNavigation();

    const getThreadIsLoading = (threadId: string) =>
        navigation && navigation.location?.pathname.includes(threadId);

    return (
        <>
            <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto] gap-4">
                <div className="col-span-12 row-span-1 flex w-full flex-1 flex-col">
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                        <Heading>{`${timeOfDayGreeting}, ${loaderData.user.profile?.firstName}. How can I help?`}</Heading>
                        <Form
                            method="POST"
                            className="flex min-w-[768px] flex-col gap-4 rounded-xl border border-zinc-300 bg-zinc-200 p-4 dark:border-zinc-600 dark:bg-zinc-800"
                        >
                            <TextFormField
                                id="prompt"
                                name="prompt"
                                helperText="What would you like to chat about?"
                                label="Prompt"
                                className="min-h-11 w-full"
                            />
                            <Field>
                                <Label>Assistant</Label>
                                <ComboBox
                                    id="assistantId"
                                    name="assistantId"
                                    options={assistants.map((assistant) => ({
                                        id: assistant.id,
                                        label: assistant.name as string,
                                    }))}
                                />
                            </Field>
                        </Form>
                    </div>
                </div>
                <div className="col-span-full p-4">
                    <Heading as="h4" className="mb-4 text-center">
                        Recent conversations
                    </Heading>
                    <div className="flex gap-4 overflow-x-auto">
                        {threads.map((thread) => (
                            <Link to={`${thread.assistant.oId}/${thread.id}`}>
                                <Card
                                    key={thread.id}
                                    className="relative flex h-full min-w-[320px] flex-col justify-between overflow-hidden"
                                >
                                    <p>{thread.name}</p>
                                    <p>{thread.assistant.name}</p>
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
