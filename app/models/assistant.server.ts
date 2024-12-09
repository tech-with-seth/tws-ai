import { AssistantTool } from "openai/resources/beta/assistants.mjs";

import { prisma } from "~/db.server";
import { ai } from "~/open-ai";
import { kebab } from "~/utils/string";

export function getAssistantCount() {
    return prisma.assistant.count();
}

export function createAssistant(
    name: string,
    instructions: string,
    extraTools?: AssistantTool[],
) {
    const tools: AssistantTool[] = [
        { type: "file_search" },
        ...(extraTools ?? []),
    ];
    const model = "gpt-4o";

    return ai.beta.assistants.create({
        name,
        instructions,
        tools,
        model,
    });
}

export function createPrismaAssistant(
    name: string,
    oId: string,
    userId: string,
    vectorStoreId?: string,
) {
    return prisma.assistant.create({
        data: {
            name,
            slug: kebab(name),
            oId,
            userId,
            vectorStoreId,
        },
    });
}

export function getAssistant(assistantId: string) {
    return ai.beta.assistants.retrieve(assistantId);
}

export function getPrismaAssistantByOpenId(assistantId: string) {
    return prisma.assistant.findUnique({
        where: {
            oId: assistantId,
        },
    });
}

export function updateAssistant(
    id: string,
    name: string,
    instructions: string,
) {
    return ai.beta.assistants.update(id, {
        instructions,
        name,
    });
}

export function updatePrismaAssistant(id: string, name: string) {
    return prisma.assistant.update({
        where: {
            oId: id,
        },
        data: {
            name,
        },
    });
}

export async function getUsersAssistants(userId: string) {
    const assistants = await prisma.assistant.findMany({
        where: {
            userId,
        },
    });

    return Promise.all(
        assistants.map((assistant) =>
            ai.beta.assistants.retrieve(assistant.oId),
        ),
    );
}

export function getAssistants() {
    return ai.beta.assistants.list({
        order: "desc",
        limit: 20,
    });
}

export function getAssistantVectorStores() {
    return ai.beta.vectorStores;
}

export function updateAssistantVectorStore(
    assistantId: string,
    vectorStoreId: string,
) {
    return ai.beta.assistants.update(assistantId, {
        tool_resources: {
            file_search: {
                vector_store_ids: [vectorStoreId],
            },
        },
    });
}

export function deleteAssistant(assistantId: string) {
    return ai.beta.assistants.del(assistantId);
}

export function deletePrismaAssistant(id: string) {
    return prisma.assistant.delete({
        where: {
            id,
        },
    });
}
