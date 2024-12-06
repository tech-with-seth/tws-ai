import { data, useFetcher, useNavigate, useParams } from "react-router";
import invariant from "tiny-invariant";

import { Button } from "~/components/Button";
import { Drawer } from "~/components/Drawer";
import { Heading } from "~/components/Heading";
import { TextFormField } from "~/components/form/TextFormField";
import useDrawer from "~/hooks/useDrawer";
import { Paths } from "~/utils/paths";
import { Route } from "./+types/create-file";
import { getAssistant } from "~/models/assistant.server";

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
    const navigate = useNavigate();
    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });
    const fileFetcher = useFetcher();

    return (
        <Drawer
            containerClassName="p-4"
            handleClose={closeDrawer}
            id="createFile"
            isOpen={isDrawerOpen}
            position="right"
            size="md"
        >
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
        </Drawer>
    );
}
