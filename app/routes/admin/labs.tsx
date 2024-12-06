import { Form, useNavigation } from "react-router";
import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { Button } from "~/components/Button";
import { createCompletion, SnippetSchema } from "~/models/completion.server";
import { Route } from "../admin/+types/labs";
import { TextFormField } from "~/components/TextFormField";
import { Code } from "~/components/Code";
import { TrashIcon } from "lucide-react";

export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const prompt = String(form.get("prompt"));

    const snippetResponse = await createCompletion(prompt, {
        schema: SnippetSchema,
        schemaTitle: "Snippet",
    });

    return {
        snippet: snippetResponse.choices[0].message.content,
    };
}

export default function Labs({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isLoading = navigation.formAction === "/admin/labs";

    useEffect(() => {
        Prism.highlightAll();
    }, [actionData]);

    const formattedSnippet = actionData?.snippet
        ? JSON.stringify(JSON.parse(actionData.snippet), null, 4)
        : "";

    return (
        <div className="px-4">
            <div className="mb-8 flex flex-col gap-4">
                <div className="flex gap-4">
                    <Button>Alfa</Button>
                    <Button color="secondary">Alfa</Button>
                    <Button color="success">Alfa</Button>
                    <Button color="warning">Alfa</Button>
                    <Button color="danger">Alfa</Button>
                </div>
                <div className="flex gap-4">
                    <Button variant="soft">Beta</Button>
                    <Button color="secondary" variant="soft">
                        Beta
                    </Button>
                    <Button color="success" variant="soft">
                        Beta
                    </Button>
                    <Button color="warning" variant="soft">
                        Beta
                    </Button>
                    <Button color="danger" variant="soft">
                        Beta
                    </Button>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline">Charlie</Button>
                    <Button color="secondary" variant="outline">
                        Charlie
                    </Button>
                    <Button color="success" variant="outline">
                        Charlie
                    </Button>
                    <Button color="warning" variant="outline">
                        Charlie
                    </Button>
                    <Button color="danger" variant="outline">
                        Charlie
                    </Button>
                </div>
                <div className="flex items-start gap-4">
                    <Button size="sm">Delta</Button>
                    <Button>Delta</Button>
                    <Button size="lg">Delta</Button>
                </div>
                <div className="flex items-start gap-4">
                    <Button iconBefore={TrashIcon}>Echo</Button>
                    <Button iconBefore={TrashIcon}>Echo</Button>
                    <Button iconBefore={TrashIcon} iconAfter={TrashIcon}>
                        Echo
                    </Button>
                </div>
                <div className="flex gap-4"></div>
            </div>
            <Form method="POST" className="mb-4 flex items-end gap-4">
                <TextFormField
                    label="Prompt"
                    name="prompt"
                    helperText="Write a prompt, get a VS Code snippet"
                />
                <Button type="submit">Submit</Button>
            </Form>
            <div>
                {!isLoading && !actionData?.snippet ? (
                    <p>Enter a prompt 👆🏻</p>
                ) : isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Code lang="js">{formattedSnippet}</Code>
                )}
            </div>
        </div>
    );
}
