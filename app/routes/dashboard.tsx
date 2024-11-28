import { Outlet } from 'react-router';
import invariant from 'tiny-invariant';

import { ButtonLink } from '~/components/ButtonLink';
import { Card } from '~/components/Card';
import { getThreadsByUserId } from '~/models/thread.server';
import { getUserId } from '~/utils/auth.server';
import { getUsersAssistants } from '~/models/assistant.server';
import { Heading } from '~/components/Heading';
import { HorizontalRule } from '~/components/HorizontalRule';
import { Paths } from '~/utils/paths';
import { Route } from './+types/dashboard';

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    invariant(userId, 'User ID is not defined');

    const assistantsResponse = await getUsersAssistants(userId);
    const assistants = assistantsResponse.map(({ id, name }) => ({
        id,
        name
    }));

    const threadsResponse = await getThreadsByUserId(userId);
    const threads = threadsResponse.map(({ id, oId, name, assistant }) => ({
        id,
        oId,
        name,
        assistant
    }));

    return {
        assistants,
        threads
    };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
    const { assistants, threads } = loaderData;

    return (
        <>
            <div className="px-4">
                <div className="flex gap-4 mb-4">
                    <Heading>Assistants</Heading>
                    <ButtonLink variant="outline" to={Paths.ASSISTANT_CREATE}>
                        Create assistant
                    </ButtonLink>
                </div>
                <div className="flex flex-wrap gap-4">
                    {assistants && assistants.length > 0 ? (
                        assistants.map((assistant) => (
                            <Card
                                key={assistant.id}
                                className="basis-1/4 min-w-[200px]"
                            >
                                {assistant.name}
                            </Card>
                        ))
                    ) : (
                        <p>No assistants available</p>
                    )}
                </div>
                <HorizontalRule space="lg" />
                <div className="flex gap-4 mb-4">
                    <Heading>Threads</Heading>
                    <ButtonLink variant="outline" to={Paths.THREAD_CREATE}>
                        Create thread
                    </ButtonLink>
                </div>
                <div>
                    {threads && threads.length > 0 ? (
                        threads.map((thread) => (
                            <Card key={thread.id}>{thread.name}</Card>
                        ))
                    ) : (
                        <p>No threads available</p>
                    )}
                </div>
            </div>
            <Outlet />
        </>
    );
}
