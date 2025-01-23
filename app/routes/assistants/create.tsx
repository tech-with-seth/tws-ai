import { useFetcher } from "react-router";
import { PlusIcon } from "lucide-react";

import { Button } from "~/components/Button";
import { Heading } from "~/components/Heading";
import { TextareaFormField } from "~/components/form/TextareaFormField";
import { TextFormField } from "~/components/form/TextFormField";
import { Paths } from "~/utils/paths";

export default function CreateAssistant() {
    const assistantFetcher = useFetcher();

    return (
        <div className="max-w-[768px]">
            <Heading className="mb-4">Create</Heading>
            <assistantFetcher.Form
                className="space-y-4"
                method="POST"
                action={Paths.API_ASSISTANTS}
            >
                <TextFormField
                    id="name"
                    label="Name"
                    name="name"
                    helperText="What do you want to name your assistant?"
                />
                <TextareaFormField
                    id="instructions"
                    label="Instructions"
                    name="instructions"
                    helperText="What do you want your assistant to do?"
                />
                <Button type="submit" iconBefore={<PlusIcon />}>
                    Create
                </Button>
            </assistantFetcher.Form>
        </div>
    );
}
