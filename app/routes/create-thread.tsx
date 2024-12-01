import { Assistant } from "openai/src/resources/beta/assistants.js";
import { useFetcher, useNavigate, useRouteLoaderData } from "react-router";

import { Button } from "~/components/Button";
import { Drawer } from "~/components/Drawer";
import { Heading } from "~/components/Heading";
import { Paths } from "~/utils/paths";
import { RadioCard } from "~/components/RadioCard";
import { TextFormField } from "~/components/TextFormField";
import useDrawer from "~/hooks/useDrawer";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Label } from "~/components/Label";

export default function CreateThread() {
    const { assistants } = useRouteLoaderData("routes/dashboard");
    const navigate = useNavigate();
    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });
    const threadFetcher = useFetcher();

    return (
        <Drawer
            containerClassName="p-4"
            handleClose={closeDrawer}
            id="createThread"
            isOpen={isDrawerOpen}
            position="right"
            size="md"
        >
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
                            name="assistant"
                            value={assistant.id}
                        >
                            {assistant.name}
                        </RadioCard>
                    ))}
                </div>
                <HorizontalRule space="lg" />
                <Button type="submit">Create</Button>
            </threadFetcher.Form>
        </Drawer>
    );
}
