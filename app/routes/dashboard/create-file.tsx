import { data, useFetcher, useParams } from "react-router";
import invariant from "tiny-invariant";

import { Button } from "~/components/Button";
import { getAssistant } from "~/models/assistant.server";
import { Heading } from "~/components/Heading";
import { Paths } from "~/utils/paths";
import { TextFormField } from "~/components/form/TextFormField";
import { Route } from "./+types/create-file";

export async function loader({ params }: Route.LoaderArgs) {
    const { assistantId } = params;
    invariant(assistantId, "Assistant ID is undefined");

    const assistant = await getAssistant(assistantId);
    const assistantName = assistant.name;

    return data({
        assistantName,
    });
}

export default function CreateFile() {
    const { assistantId } = useParams();
    const fileFetcher = useFetcher();

    return (
        <div className="p-4">
            <Heading className="mb-4">Create file</Heading>
            <fileFetcher.Form
                className="space-y-4"
                method="POST"
                action={Paths.API_FILES}
            >
                <input type="hidden" name="assistantId" value={assistantId} />
                <TextFormField
                    id="title"
                    label="Title"
                    name="fileName"
                    helperText="What is the file title?"
                />
                <TextFormField
                    id="content"
                    label="Content"
                    name="content"
                    helperText="What content would you like to write?"
                />
                <Button type="submit" name="intent" value="createFile">
                    Create
                </Button>
            </fileFetcher.Form>
        </div>
    );
}
