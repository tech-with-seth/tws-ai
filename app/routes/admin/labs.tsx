import { Form, useNavigation } from "react-router";
import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { Button } from "~/components/Button";
import { createCompletion, SnippetSchema } from "~/models/completion.server";
import { Route } from "../admin/+types/labs";
import { TextFormField } from "~/components/TextFormField";
import { Code } from "~/components/Code";

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
    const isLoading = navigation.state === "loading";

    useEffect(() => {
        Prism.highlightAll();
    }, [actionData]);

    const formattedSnippet = actionData?.snippet
        ? JSON.stringify(JSON.parse(actionData.snippet), null, 4)
        : "";

    return (
        <div className="px-4">
            <Form method="POST" className="mb-4">
                <TextFormField label="Prompt" name="prompt" />
                <Button type="submit">Submit</Button>
            </Form>
            <div>
                {!actionData?.snippet ? (
                    <p>Waiting for prompt.</p>
                ) : isLoading || !actionData?.snippet ? (
                    <p>Loading...</p>
                ) : (
                    <Code lang="js">{formattedSnippet}</Code>
                )}
            </div>
        </div>
    );
}
