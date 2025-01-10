import { Outlet, useFetcher, useNavigation } from "react-router";
import invariant from "tiny-invariant";
import {
    FileIcon,
    FileQuestion,
    ListIcon,
    LoaderPinwheelIcon,
    MessagesSquareIcon,
    PencilIcon,
    SparkleIcon,
    TrashIcon,
} from "lucide-react";
import { PortableText } from "@portabletext/react";

import { Banner } from "~/components/Banner";
import { Button } from "~/components/Button";
import { ButtonLink } from "~/components/ButtonLink";
import { Card } from "~/components/Card";
import { getThreadsByUserId } from "~/models/thread.server";
import { getUser } from "~/utils/auth.server";
import { getUsersAssistants } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Paths } from "~/utils/paths";
import { ellipsisify } from "~/utils/string";
import { Route } from "../dashboard/+types";
import { p } from "node_modules/@react-router/dev/dist/routes-DHIOx0R9";

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
    const navigation = useNavigation();

    const threadFetcher = useFetcher();
    const getCreateThreadChatIcon = (assistantId: string) =>
        threadFetcher.state !== "idle" &&
        threadFetcher.formAction?.includes(assistantId) ? (
            <LoaderPinwheelIcon className="h-4 w-4 animate-spin" />
        ) : (
            <SparkleIcon className="h-4 w-4" />
        );

    const getDeleteAssistantIcon = (assistantId: string) =>
        threadFetcher.state !== "idle" &&
        threadFetcher.formMethod === "DELETE" &&
        threadFetcher.formData?.get("assistantId") === assistantId ? (
            <LoaderPinwheelIcon className="h-4 w-4 animate-spin" />
        ) : (
            <TrashIcon className="h-4 w-4" />
        );

    const deleteThreadFetcher = useFetcher();
    const getDeleteChatIcon = (threadId: string) =>
        deleteThreadFetcher.state !== "idle" &&
        deleteThreadFetcher.formAction?.includes(threadId) ? (
            <LoaderPinwheelIcon className="h-4 w-4 animate-spin" />
        ) : (
            <TrashIcon className="h-4 w-4" />
        );

    const agents = [] as any;

    return (
        <>
            <div className="px-4">
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_ASSISTANT}
                        color="secondary"
                        iconBefore={<PencilIcon className="h-4 w-4" />}
                    >
                        Create assistant
                    </ButtonLink>
                </div>
                <div className="grid grid-cols-12 gap-3">
                    {assistants && assistants.length > 0 ? (
                        assistants.map(
                            ({ id, name, description, instructions }) => (
                                <Card
                                    key={id}
                                    className="col-span-full flex h-full flex-col flex-wrap justify-between gap-2 sm:col-span-6 lg:col-span-4 xl:col-span-3"
                                >
                                    <div>
                                        <Heading as="h4">{name}</Heading>
                                        {description && <p>{description}</p>}
                                        {instructions && (
                                            <p className="mb-4">
                                                {ellipsisify(instructions)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 md:flex-wrap">
                                        <threadFetcher.Form
                                            method="DELETE"
                                            action="/api/assistants"
                                        >
                                            <input
                                                type="hidden"
                                                name="assistantId"
                                                value={id}
                                            />
                                            <Button
                                                className="h-full"
                                                size="sm"
                                                type="submit"
                                                color="danger"
                                                iconBefore={getDeleteAssistantIcon(
                                                    id,
                                                )}
                                            >
                                                Delete
                                            </Button>
                                        </threadFetcher.Form>
                                        <ButtonLink
                                            to={`/${id}`}
                                            size="sm"
                                            variant="outline"
                                            color="secondary"
                                            iconBefore={
                                                <ListIcon className="h-4 w-4" />
                                            }
                                        >
                                            Details
                                        </ButtonLink>
                                        <ButtonLink
                                            to={`${id}/create-file`}
                                            size="sm"
                                            variant="outline"
                                            color="secondary"
                                            iconBefore={
                                                <FileIcon className="h-4 w-4" />
                                            }
                                        >
                                            Add file
                                        </ButtonLink>
                                        <threadFetcher.Form
                                            method="POST"
                                            action={`${Paths.API_THREADS}?assistantId=${id}`}
                                        >
                                            <input
                                                type="hidden"
                                                name="assistantId"
                                                value={id}
                                            />
                                            <Button
                                                size="sm"
                                                type="submit"
                                                color="secondary"
                                                iconBefore={getCreateThreadChatIcon(
                                                    id,
                                                )}
                                            >
                                                New thread
                                            </Button>
                                        </threadFetcher.Form>
                                    </div>
                                </Card>
                            ),
                        )
                    ) : (
                        <Banner
                            icon={<FileQuestion className="h-4 w-4" />}
                            className="min-w-[200px] basis-1/4"
                            variant="warning"
                        >
                            No assistants available
                        </Banner>
                    )}
                </div>
                <HorizontalRule space="lg" />
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Agents</Heading>
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_ASSISTANT}
                        color="secondary"
                        iconBefore={<PencilIcon className="h-4 w-4" />}
                    >
                        Create agent
                    </ButtonLink>
                </div>
                <div className="grid grid-cols-12 gap-3">
                    {agents && agents.length > 0 ? (
                        <div className="col-span-full flex h-full flex-col flex-wrap justify-between gap-2 sm:col-span-6 lg:col-span-4 xl:col-span-3">
                            <p>Placeholder...</p>
                        </div>
                    ) : (
                        <Banner
                            className="col-span-full sm:col-span-6 lg:col-span-4 xl:col-span-3"
                            icon={<FileQuestion className="h-4 w-4" />}
                            variant="warning"
                        >
                            No agents available
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
                                        to={`/dashboard/${thread.assistant.oId}/${thread.id}`}
                                        size="sm"
                                        color="secondary"
                                        iconBefore={
                                            navigation.state !== "idle" &&
                                            navigation.location.pathname.includes(
                                                thread.id,
                                            ) ? (
                                                <LoaderPinwheelIcon className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <MessagesSquareIcon className="h-4 w-4" />
                                            )
                                        }
                                    >
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
        </>
    );
}
