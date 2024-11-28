import { useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/Button";
import { Drawer } from "~/components/Drawer";
import { Heading } from "~/components/Heading";
import { TextFormField } from "~/components/TextFormField";
import useDrawer from "~/hooks/useDrawer";
import { Paths } from "~/utils/paths";

export default function CreateAssistant() {
    const navigate = useNavigate();
    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });
    const assistantFetcher = useFetcher();

    return (
        <Drawer
            containerClassName="p-4"
            handleClose={closeDrawer}
            id="createAssistant"
            isOpen={isDrawerOpen}
            position="right"
            size="md"
        >
            <Heading className="mb-4">Create assistant</Heading>
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
                <TextFormField
                    id="instructions"
                    label="Instructions"
                    name="instructions"
                    helperText="What do you want your assistant to do?"
                />
                <Button type="submit">Create</Button>
            </assistantFetcher.Form>
        </Drawer>
    );
}
