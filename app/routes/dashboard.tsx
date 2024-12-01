import { Outlet } from "react-router";
import invariant from "tiny-invariant";

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
import { FileQuestion } from "lucide-react";
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

    return (
        <>
            <div className="px-4">
                <div className="mb-4 flex gap-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink variant="outline" to={Paths.CREATE_ASSISTANT}>
                        Create assistant
                    </ButtonLink>
                </div>
                <div className="flex flex-wrap gap-4">
                    {assistants && assistants.length > 0 ? (
                        assistants.map(
                            ({ id, name, description, instructions }) => (
                                <Card
                                    key={id}
                                    className="min-w-[200px] basis-1/4"
                                >
                                    <Heading as="h4">{name}</Heading>
                                    {description && <p>{description}</p>}
                                    <p>{instructions}</p>
                                    <ButtonLink to={`${id}/create-file`}>
                                        Add file
                                    </ButtonLink>
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
                <div className="mb-4 flex gap-4">
                    <Heading>Threads</Heading>
                    <ButtonLink variant="outline" to={Paths.CREATE_THREAD}>
                        Create thread
                    </ButtonLink>
                </div>
                <div className="flex flex-wrap gap-4">
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <Card
                                key={thread.id}
                                className="min-w-[200px] basis-1/4"
                            >
                                <Heading as="h4">
                                    {thread.name ?? "Untitled"}
                                </Heading>
                                <ButtonLink
                                    to={`/dashboard/${thread.assistant.oId}/${thread.id}`}
                                >
                                    Open chat
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
