import { Assistant } from "openai/src/resources/beta/assistants.js";
import { useFetcher, useRouteLoaderData } from "react-router";

import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { Paths } from "~/utils/paths";
import { RadioCard } from "~/components/form/RadioCard";
import { TextFormField } from "~/components/form/TextFormField";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Label } from "~/components/form/Label";

export default function CreateThread() {
    const { assistants } = useRouteLoaderData("routes/dashboard");
    const threadFetcher = useFetcher();

    return (
        <>
            <Heading className="mb-4">Create thread</Heading>
            <threadFetcher.Form method="POST" action={Paths.API_THREADS}>
                <TextFormField
                    id="name"
                    className="mb-4"
                    label="Name"
                    name="name"
                    helperText="What do you want to name your thread?"
                />
                <Label className="mb-4">Who do you want to chat with?</Label>
                <div className="flex gap-4">
                    {assistants.map((assistant: Assistant) => (
                        <RadioCard
                            id={assistant.id}
                            key={assistant.id}
                            name="assistantId"
                            value={assistant.id}
                        >
                            {assistant.name}
                        </RadioCard>
                    ))}
                </div>
                <HorizontalRule space="lg" />
                <Button type="submit">Create</Button>
            </threadFetcher.Form>
        </>
    );
}
