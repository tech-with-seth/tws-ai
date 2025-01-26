import invariant from "tiny-invariant";

import { getUsersAssistants } from "~/models/assistant.server";
import { getUserId } from "~/utils/auth.server";
import { Route } from "../assistants/+types";
import { Heading } from "~/components/Heading";
import { cache } from "~/utils/cache";
import { Details } from "~/components/Details";

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID not found");

    return {
        assistants: await getUsersAssistants(userId),
    };
}

// TODO: Improve caching - data is stale :(
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    if (cache.getKey("assistantsData")) {
        return cache.getKey("assistantsData") as Awaited<
            ReturnType<typeof serverLoader>
        >;
    } else {
        const freshAssistantsData = await serverLoader();
        cache.set("assistantsData", freshAssistantsData);
        cache.save();

        return freshAssistantsData;
    }
}

clientLoader.hydrate = true;

export default function AssistantsIndexRoute({
    loaderData,
}: Route.ComponentProps) {
    return (
        <>
            <ul className="space-y-4">
                {loaderData.assistants.map((assistant) => (
                    <li key={assistant.id}>
                        <Heading as="h3">{assistant.name}</Heading>
                        <p className="mb-4 block">
                            {assistant.description || "No description provided"}
                        </p>
                        <Details text="See instructions">
                            <p className="mt-2">
                                {assistant.instructions ||
                                    "No description provided"}
                            </p>
                        </Details>
                    </li>
                ))}
            </ul>
        </>
    );
}
