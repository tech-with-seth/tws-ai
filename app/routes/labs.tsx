import { data, Form, useNavigation } from "react-router";
import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { Button } from "~/components/Button";
import {
    createCompletion,
    createToolCompletion,
} from "~/models/completion.server";
import { TextFormField } from "~/components/form/TextFormField";
import { Code } from "~/components/Code";
import { TrashIcon } from "lucide-react";
import { HorizontalRule } from "~/components/HorizontalRule";
import { handleCompletionResponse } from "~/utils/common";
import { Heading } from "~/components/Heading";
import { getThreadCount } from "~/models/thread.server";
import { getUserCount } from "~/models/user.server";
import {
    createAssistant,
    createPrismaAssistant,
    getAssistantCount,
    updateAssistantVectorStore,
} from "~/models/assistant.server";
import { getFileCount } from "~/models/file.server";
import { createCompany, getCompanyCount } from "~/models/company.server";
import invariant from "tiny-invariant";
import { Skeleton } from "~/components/Skeleton";
import { createVectorStore } from "~/models/vectorStore.server";
import { kebab } from "~/utils/string";
import { getUserId } from "~/utils/auth.server";
import { Route } from "./+types/labs";
import { client } from "~/sanity-client";
import { AssistantSchema, CompanySchema, SnippetSchema } from "~/utils/schemas";
import { ChatCompletion } from "openai/resources/index.mjs";
import { ac } from "node_modules/react-router/dist/development/route-data-DuV3tXo2.mjs";
// import { PortableText } from "@portabletext/react";

function blocksToText(blocks: any, opts = {}) {
    const options = Object.assign({}, { nonTextBehavior: "remove" }, opts);
    return blocks
        .map((block: any) => {
            if (block._type !== "block" || !block.children) {
                return options.nonTextBehavior === "remove"
                    ? ""
                    : `[${block._type} block]`;
            }

            return block.children.map((child: any) => child.text).join("");
        })
        .join("\n\n");
}

function extractFunctionsData(response: ChatCompletion) {
    const toolCalls = response.choices[0]?.message?.tool_calls || [];

    return toolCalls.map((toolCall) => {
        const { name, arguments: args } = toolCall.function;

        let parsedArgs: Record<string, any> = {};
        try {
            parsedArgs = JSON.parse(args); // Parse JSON arguments
        } catch (error) {
            console.error(
                `Failed to parse arguments for function ${name}:`,
                error,
            );
        }

        return {
            name,
            parameters: parsedArgs,
        };
    });
}

export async function loader() {
    const articles = await client.fetch('*[_type == "article"]');

    const combined = articles.reduce(
        (
            combinedString: string,
            currentArticle: { title: string; details: string },
        ) => {
            return `${combinedString}

## ${currentArticle.title}
${blocksToText(currentArticle.details)}

`;
        },
        "",
    );

    return data({
        articles,
        combined,
        assistantCount: await getAssistantCount(),
        companyCount: await getCompanyCount(),
        fileCount: await getFileCount(),
        threadCount: await getThreadCount(),
        userCount: await getUserCount(),
    });
}

export async function action({ request }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID not found");

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

    if (intent === "createCompany") {
        const companyCompletionResponse = await createCompletion(
            `Create a company name and description. Make it professional. Keep the description to no more than 50 words: ${prompt}`,
            {
                schema: CompanySchema,
                schemaTitle: "Company",
            },
        );

        const company = handleCompletionResponse(companyCompletionResponse);
        invariant(company, "Company not found");

        const parsedCompany = JSON.parse(company);

        await createCompany({
            name: parsedCompany?.name,
            description: parsedCompany?.description ?? "No description",
        });

        return { company };
    }

    if (intent === "createAssistant") {
        const assistantCompletionResponse = await createCompletion(
            `Create an Open AI assistant. Follow the provide Zod schema. In the instructions be descriptive. Add examples to the instructions so that the assistant can relay information in a way that is useful. Here's what the assistant should be like: ${prompt}`,
            {
                schema: AssistantSchema,
                schemaTitle: "Assistant",
            },
        );

        const assistant = handleCompletionResponse(assistantCompletionResponse);
        invariant(assistant, "Assistant completion not found");

        const parsedAssistant = JSON.parse(assistant);
        const vectorStore = await createVectorStore(
            kebab(`${parsedAssistant.name} store`),
        );

        const createdAssistant = await createAssistant(
            parsedAssistant.name,
            parsedAssistant.instructions,
            parsedAssistant.description,
        );
        await createPrismaAssistant(
            parsedAssistant.name,
            createdAssistant.id,
            userId,
            vectorStore.id,
        );
        await updateAssistantVectorStore(createdAssistant.id, vectorStore.id);

        return { assistant };
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

    if (intent === "tertiaryAction") {
        const stories = String(form.get("stories"));

        const tertiaryResponse = await createCompletion(
            `Take the following stories and use them to answer questions based upon those stories: ${stories}

Question: ${prompt}
`,
        );
        const tertiaryActionText = handleCompletionResponse(tertiaryResponse);

        return {
            tertiaryActionText,
        };
    }

    if (intent === "toolsAction") {
        const toolsCompletionResponse = await createToolCompletion(prompt, [
            {
                type: "function",
                function: {
                    name: "getFavoriteColor",
                    description:
                        "Get the favorite color of the user based on their location",
                    parameters: {
                        type: "object",
                        properties: {
                            color: {
                                type: "string",
                                description: "The user's favorite color",
                            },
                        },
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "getFavoriteShape",
                    description: "Get the favorite shape of the user",
                    parameters: {
                        type: "object",
                        properties: {
                            shape: {
                                type: "string",
                                description: "The user's favorite shape",
                            },
                        },
                    },
                },
            },
        ]);

        return {
            extracted: extractFunctionsData(toolsCompletionResponse),
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
        ? JSON.stringify(JSON.parse(actionData?.snippet), null, 4)
        : "";

    return (
        <>
            <div className="p-4">
                <Heading as="h1" className="mb-8 text-6xl font-bold">
                    Labs
                </Heading>
                <div className="grid gap-4 lg:grid-cols-12">
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
                            <HorizontalRule />
                            <div className="flex flex-wrap items-start gap-4">
                                <div className="flex flex-col gap-2">
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Skeleton variant="square" />
                                    <Skeleton variant="square" />
                                    <Skeleton variant="square" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Skeleton variant="block" />
                                    <Skeleton variant="block" />
                                    <Skeleton variant="block" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Snippet Prompt"
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
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Funny Prompt"
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
                        <HorizontalRule />
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <input
                                type="hidden"
                                name="stories"
                                value={loaderData.combined}
                            />
                            <TextFormField
                                label="Question the stories"
                                name="prompt"
                                helperText="Ask about stories"
                            />
                            <Button
                                type="submit"
                                name="intent"
                                value="tertiaryAction"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div>
                            {!isLoading && !actionData?.tertiaryActionText ? (
                                <p>Enter a prompt 👆🏻</p>
                            ) : isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div>{actionData?.tertiaryActionText}</div>
                            )}
                        </div>
                        <HorizontalRule />
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Company Prompt"
                                name="prompt"
                                helperText="Have ChatGPT add a company to the database"
                            />
                            <Button
                                type="submit"
                                name="intent"
                                value="createCompany"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div>
                            {!isLoading && !actionData?.company ? (
                                <p>Enter a prompt 👆🏻</p>
                            ) : isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <Code lang="js">{actionData?.company}</Code>
                            )}
                        </div>
                        <HorizontalRule />
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Assistant Prompt"
                                name="prompt"
                                helperText="Have ChatGPT add an assitant to the database 🤯"
                            />
                            <Button
                                type="submit"
                                name="intent"
                                value="createAssistant"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div>
                            {!isLoading && !actionData?.assistant ? (
                                <p>Enter a prompt 👆🏻</p>
                            ) : isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <Code lang="js">{actionData?.assistant}</Code>
                            )}
                        </div>
                        <HorizontalRule />
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Functions"
                                name="prompt"
                                helperText="Tell us your favorite color or shape"
                            />
                            <Button
                                type="submit"
                                name="intent"
                                value="toolsAction"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div>
                            <pre>
                                <code className="block overflow-x-auto rounded bg-gray-800 p-2 text-white">
                                    {actionData?.extracted &&
                                        JSON.stringify(actionData?.extracted)}
                                </code>
                            </pre>
                        </div>
                        <HorizontalRule />
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
                            Companies:{" "}
                            <span className="font-bold">
                                {loaderData.companyCount}
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
                        {loaderData.combined}
                    </div>
                </div>
            </div>
        </>
    );
}
