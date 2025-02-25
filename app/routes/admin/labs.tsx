import { Form, useNavigation } from "react-router";
import { useEffect } from "react";
import { openai } from "@ai-sdk/openai";
import { CoreMessage } from "ai";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { Button } from "~/components/Button";
import {
    createCompletion,
    createToolCompletion,
} from "~/models/completion.server";
import { TextFormField } from "~/components/form/TextFormField";
import { Code } from "~/components/Code";
import { HorizontalRule } from "~/components/HorizontalRule";
import {
    blocksToText,
    extractFunctionsData,
    handleCompletionResponse,
} from "~/utils/common";
import { Heading } from "~/components/Heading";

import {
    createAssistant,
    createPrismaAssistant,
    updateAssistantVectorStore,
} from "~/models/assistant.server";
import { createCompany } from "~/models/company.server";
import invariant from "tiny-invariant";
import { createVectorStore } from "~/models/vectorStore.server";
import { kebab } from "~/utils/string";
import { getUserId } from "~/utils/auth.server";
import { client } from "~/sanity-client";
import { AssistantSchema, CompanySchema, SnippetSchema } from "~/utils/schemas";
import { cache } from "~/utils/cache";
import { generateText, tool } from "ai";
import { z } from "zod";
import {
    createProfileForUser,
    deleteProfileByUserId,
    updateProfileByUserId,
    upsertProfileForUser,
} from "~/models/profile.server";
import { Route } from "../admin/+types/labs";
import { Details } from "~/components/Details";
import { auth } from "@trigger.dev/sdk/v3";
import { useRealtimeRun, useTaskTrigger } from "@trigger.dev/react-hooks";
import { TriggerCard } from "~/components/TriggerCard";

// const RUN_ID = "run_y8yz63qdmrztywrigonbi";
const TASK_ID = "document-updater";

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

    const triggerToken = await auth.createTriggerPublicToken(TASK_ID);

    return {
        articles,
        combined,
        triggerToken,
    };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    if (cache.getKey("labsData")) {
        return cache.getKey("labsData") as Awaited<
            ReturnType<typeof serverLoader>
        >;
    } else {
        const freshLabsData = await serverLoader();
        cache.set("labsData", freshLabsData);
        cache.save();

        return freshLabsData;
    }
}

clientLoader.hydrate = true;

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

    if (intent === "toolsAction2") {
        const createProfileTool = tool({
            description: "Add a new profile to a user",
            parameters: z.object({
                firstName: z.string(),
                lastName: z.string(),
            }),
            execute: async ({ firstName, lastName }) => {
                const response = await upsertProfileForUser({
                    userId,
                    firstName,
                    lastName,
                });

                return response;
            },
        });

        const updateProfileTool = tool({
            description: "Update a user profile",
            parameters: z.object({
                firstName: z.string(),
                lastName: z.string(),
            }),
            execute: async ({ firstName, lastName }) => {
                const userId = (await getUserId(request)) as string;
                const response = await updateProfileByUserId(userId, {
                    firstName,
                    lastName,
                });

                return response;
            },
        });

        const deleteProfileTool = tool({
            description: "Deletes a user's profile",
            parameters: z.object({}),
            execute: async () => {
                const response = await deleteProfileByUserId(userId);

                return response;
            },
        });

        const { text: answer, steps } = await generateText({
            model: openai("gpt-4o-mini"),
            tools: {
                createProfile: createProfileTool,
                updateProfile: updateProfileTool,
                deleteProfile: deleteProfileTool,
            },
            maxSteps: 5,
            system: `Your goal is to perform CRUD operations on a user's profile.`,
            prompt: `User ID is ${userId}. ${prompt}`,
            onStepFinish({
                text,
                toolCalls,
                toolResults,
                finishReason,
                usage,
            }) {
                // your own logic, e.g. for saving the chat history or recording usage
                console.log(
                    "===== LOG =====",
                    JSON.stringify(
                        { text, toolCalls, toolResults, finishReason, usage },
                        null,
                        4,
                    ),
                );
            },
        });

        return {
            answer,
            steps,
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
                    <div className="col-span-6">
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
                                label="Functions & tools 🤯🤯🤯"
                                name="prompt"
                                helperText="Create or update a profile attached to a user via prompt"
                                defaultValue={`First name Seth, last name Davis`}
                            />
                            <Button
                                type="submit"
                                name="intent"
                                value="toolsAction2"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div>
                            {!isLoading && !actionData ? (
                                <p>Enter a prompt 👆🏻</p>
                            ) : isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <pre>
                                    <code className="block overflow-x-auto rounded bg-gray-800 p-2 text-white">
                                        {actionData &&
                                            JSON.stringify(actionData, null, 4)}
                                    </code>
                                </pre>
                            )}
                        </div>
                        <HorizontalRule />
                        <Form
                            method="POST"
                            className="mb-4 flex items-end gap-4"
                        >
                            <TextFormField
                                label="Assistant Prompt 🤯"
                                name="prompt"
                                helperText="Have ChatGPT add an assitant to the database (structured output)"
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
                    </div>
                    <div className="col-span-6">
                        <TriggerCard
                            cta={`Trigger "document-updater"`}
                            taskId={TASK_ID}
                        />
                    </div>
                </div>
            </div>
            <Details text="Archive">
                <Form method="POST" className="mb-4 flex items-end gap-4">
                    <TextFormField
                        label="Snippet Prompt"
                        name="prompt"
                        helperText="Write a prompt, get a VS Code snippet"
                    />
                    <Button type="submit" name="intent" value="createSnippet">
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
                        label="Funny Prompt"
                        name="prompt"
                        helperText="Say Hooo Boy! after every response"
                    />
                    <Button type="submit" name="intent" value="secondaryAction">
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
                <Form method="POST" className="mb-4 flex items-end gap-4">
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
                    <Button type="submit" name="intent" value="tertiaryAction">
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
            </Details>
        </>
    );
}
