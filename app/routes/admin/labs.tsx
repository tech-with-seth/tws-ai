import { data, Form, useNavigation } from "react-router";
import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { Button } from "~/components/Button";
import { createCompletion, SnippetSchema } from "~/models/completion.server";
import { Route } from "../admin/+types/labs";
import { TextFormField } from "~/components/form/TextFormField";
import { Code } from "~/components/Code";
import { TrashIcon } from "lucide-react";
import { HorizontalRule } from "~/components/HorizontalRule";
import { handleCompletionResponse } from "~/utils/common";
import { Heading } from "~/components/Heading";
import { getThreadCount } from "~/models/thread.server";
import { getUserCount } from "~/models/user.server";
import { getAssistantCount } from "~/models/assistant.server";
import { getFileCount } from "~/models/file.server";

export async function loader() {
    return data({
        assistantCount: await getAssistantCount(),
        fileCount: await getFileCount(),
        threadCount: await getThreadCount(),
        userCount: await getUserCount(),
    });
}

export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const prompt = String(form.get("prompt"));
    const intent = String(form.get("intent"));

    if (intent === "createSnippet") {
        const snippetResponse = await createCompletion(prompt, {
            schema: SnippetSchema,
            schemaTitle: "Snippet",
        });

        return {
            snippet: handleCompletionResponse(snippetResponse),
        };
    }

    if (intent === "secondaryAction") {
        const secondaryResponse = await createCompletion(
            `Say "Hooo boy!" after every response. Respond to the following: ${prompt}`,
        );
        const secondaryActionText = handleCompletionResponse(secondaryResponse);

        return {
            secondaryActionText,
        };
    }

    return null;
}

export default function Labs({ actionData, loaderData }: Route.ComponentProps) {
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
            <Heading as="h1" className="mb-8 text-6xl font-bold">
                Labs
            </Heading>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
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
                            <Button iconBefore={<TrashIcon />}>Echo</Button>
                            <Button iconBefore={<TrashIcon />}>Echo</Button>
                            <Button
                                iconBefore={<TrashIcon />}
                                iconAfter={<TrashIcon />}
                            >
                                Echo
                            </Button>
                        </div>
                        <div className="flex gap-4"></div>
                    </div>
                </div>
                <div className="col-span-4">
                    <Form method="POST" className="mb-4 flex items-end gap-4">
                        <TextFormField
                            label="Prompt"
                            name="prompt"
                            helperText="Write a prompt, get a VS Code snippet"
                        />
                        <Button
                            type="submit"
                            name="intent"
                            value="createSnippet"
                        >
                            Submit
                        </Button>
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
                    <HorizontalRule />
                    <Form method="POST" className="mb-4 flex items-end gap-4">
                        <TextFormField
                            label="Prompt"
                            name="prompt"
                            helperText="Say Hooo Boy! after every response"
                        />
                        <Button
                            type="submit"
                            name="intent"
                            value="secondaryAction"
                        >
                            Submit
                        </Button>
                    </Form>
                    <div>
                        {!isLoading && !actionData?.secondaryActionText ? (
                            <p>Enter a prompt 👆🏻</p>
                        ) : isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>{actionData?.secondaryActionText}</div>
                        )}
                    </div>
                </div>
                <div className="col-span-4 flex flex-col gap-4">
                    <Heading as="h2">Stats</Heading>
                    <Heading as="h3" className="font-thin">
                        Assistants:{" "}
                        <span className="font-bold">
                            {loaderData.assistantCount}
                        </span>
                    </Heading>
                    <Heading as="h3" className="font-thin">
                        Files:{" "}
                        <span className="font-bold">
                            {loaderData.fileCount}
                        </span>
                    </Heading>
                    <Heading as="h3" className="font-thin">
                        Threads:{" "}
                        <span className="font-bold">
                            {loaderData.threadCount}
                        </span>
                    </Heading>
                    <Heading as="h3" className="font-thin">
                        Users:{" "}
                        <span className="font-bold">
                            {loaderData.userCount}
                        </span>
                    </Heading>
                </div>
            </div>
        </div>
    );
}
