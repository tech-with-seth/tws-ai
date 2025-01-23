import { data } from "react-router";
import { Route } from "./+types/assistant-details";
import invariant from "tiny-invariant";
import { getAssistant } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { List } from "~/components/List";

export async function loader({ params }: Route.LoaderArgs) {
    const { assistantId } = params;
    invariant(assistantId, "Assistant ID is not defined");

    const assistant = await getAssistant(assistantId);

    return data({
        assistant,
    });
}

export default function AssistantDetails({ loaderData }: Route.ComponentProps) {
    return (
        <div className="px-4">
            <Heading as="h1" className="mb-4">
                {loaderData.assistant.name ?? "n/a"}
            </Heading>
            <List
                items={[
                    <p>
                        <strong>Model:</strong>{" "}
                        {loaderData.assistant.model ?? "n/a"}
                    </p>,
                    <p>
                        <strong>Instructions:</strong>{" "}
                        {loaderData.assistant.instructions ?? "n/a"}
                    </p>,
                    <p>
                        <strong>Description:</strong>{" "}
                        {loaderData.assistant.description ?? "n/a"}
                    </p>,
                ]}
            />
        </div>
    );
}
