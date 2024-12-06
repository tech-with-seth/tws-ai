import { Outlet, useFetcher } from "react-router";
import invariant from "tiny-invariant";
import {
    FileIcon,
    FileQuestion,
    ListIcon,
    MessagesSquareIcon,
    PencilIcon,
    SparkleIcon,
    TrashIcon,
} from "lucide-react";

import { ButtonLink } from "~/components/ButtonLink";
import { Card } from "~/components/Card";
import { getThreadsByUserId } from "~/models/thread.server";
import { getUserId } from "~/utils/auth.server";
import { getUsersAssistants } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Paths } from "~/utils/paths";
import { Route } from "../+types/dashboard";
import { Banner } from "~/components/Banner";
import { Button } from "~/components/Button";

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
    const threadFetcher = useFetcher();
    const deleteThreadFetcher = useFetcher();

    return (
        <>
            <div className="px-4">
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_ASSISTANT}
                    >
                        <PencilIcon />
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
                                        >
                                            <FileIcon className="h-4 w-4" />
                                            <span className="inline-block">
                                                Add file
                                            </span>
                                        </ButtonLink>
                                        <threadFetcher.Form
                                            method="POST"
                                            action={Paths.API_THREADS}
                                        >
                                            <input
                                                type="hidden"
                                                name="assistantId"
                                                value={id}
                                            />
                                            <Button
                                                className="inline-flex items-center gap-1"
                                                size="sm"
                                                type="submit"
                                                iconBefore={SparkleIcon}
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
                                        <span className="inline-block rounded-xl bg-secondary-500 px-2 py-1 text-white dark:text-white">
                                            {thread.assistant.name}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <deleteThreadFetcher.Form
                                        method="DELETE"
                                        action={`/api/thread/${thread.id}`}
                                    >
                                        <Button
                                            className="inline-flex items-center gap-2 self-end"
                                            size="sm"
                                            type="submit"
                                            iconBefore={TrashIcon}
                                        >
                                            Delete chat
                                        </Button>
                                    </deleteThreadFetcher.Form>
                                    <ButtonLink
                                        className="inline-flex items-center gap-2 self-end"
                                        to={`/dashboard/${thread.assistant.oId}/${thread.id}`}
                                        size="sm"
                                    >
                                        <MessagesSquareIcon /> Open chat
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
