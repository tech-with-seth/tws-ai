import { Outlet } from "react-router";
import invariant from "tiny-invariant";
import {
    BotIcon,
    FileQuestion,
    MessagesSquareIcon,
    PlusIcon,
} from "lucide-react";

import { ButtonLink } from "~/components/ButtonLink";
import { Card } from "~/components/Card";
import { getThreadsByUserId } from "~/models/thread.server";
import { getUserId } from "~/utils/auth.server";
import { getUsersAssistants } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Paths } from "~/utils/paths";
import { Route } from "./+types/dashboard";
import { Banner } from "~/components/Banner";

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

    return (
        <>
            <div className="px-4">
                <div className="mb-4 flex items-center gap-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_ASSISTANT}
                    >
                        <PlusIcon />
                        Create assistant
                    </ButtonLink>
                </div>
                <div className="flex gap-4">
                    {assistants && assistants.length > 0 ? (
                        assistants.map(
                            ({ id, name, description, instructions }) => (
                                <Card
                                    key={id}
                                    className="flex min-w-[150px] basis-1/4 flex-col justify-between"
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
                                            <BotIcon className="h-4 w-4" />
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
                                            <PlusIcon className="h-4 w-4" />
                                            <span className="inline-block">
                                                Add file
                                            </span>
                                        </ButtonLink>
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
                    <ButtonLink
                        className="inline-flex items-center gap-2"
                        to={Paths.CREATE_THREAD}
                    >
                        <PlusIcon />
                        Create thread
                    </ButtonLink>
                </div>
                <div className="flex gap-4">
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <Card
                                key={thread.id}
                                className="flex min-w-[150px] basis-1/4 flex-col justify-between"
                            >
                                <div>
                                    <Heading as="h4">
                                        {thread.name ?? "Untitled"}
                                    </Heading>
                                    <p className="mb-4">
                                        Chatting with: {thread.assistant.name}
                                    </p>
                                </div>
                                <ButtonLink
                                    className="inline-flex items-center gap-2 self-end"
                                    to={`/dashboard/${thread.assistant.oId}/${thread.id}`}
                                    variant="outline"
                                    size="sm"
                                >
                                    <MessagesSquareIcon /> Open chat
                                </ButtonLink>
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
