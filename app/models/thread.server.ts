import { PagePromise, RequestOptions } from "openai/core.mjs";
import {
    Message,
    MessageListParams,
    MessagesPage,
} from "openai/resources/beta/threads/messages.mjs";

import { prisma } from "~/db.server";
import { ai } from "~/open-ai";
import { kebab } from "~/utils/string";
import { createCompletion } from "./completion.server";
import { ThreadTitleSchema } from "~/utils/schemas";

export function getThreadCount() {
    return prisma.thread.count();
}

export async function getThreadsByUserId(userId: string): Promise<any[]> {
    const threads = await prisma.thread.findMany({
        where: {
            userId,
        },
        include: {
            assistant: true,
        },
    });

    const userThreads = await Promise.all(
        threads.map((thread) => ai.beta.threads.retrieve(thread.oId)),
    );

    return new Promise((resolve) => {
        const mapped = userThreads.map((thread) => {
            const prismaThread = threads.find((t) => t.oId === thread.id);

            return {
                ...thread,
                name: prismaThread?.name,
                slug: prismaThread?.slug,
                assistant: prismaThread?.assistant,
            };
        });

        resolve(mapped);
    });
}

export function getPrismaThreads() {
    return prisma.thread.findMany();
}

export async function getPrismaThreadsByUserId(userId: string) {
    return prisma.thread.findMany({
        where: {
            userId,
        },
        include: {
            assistant: true,
        },
    });
}

export function getThreadByOpenId(
    oId: string,
    includeAssistant: boolean = true,
) {
    return prisma.thread.findUnique({
        where: {
            oId,
        },
        include: {
            assistant: includeAssistant,
        },
    });
}

export function getThreadMessages(
    threadId: string,
    query?: MessageListParams,
    options?: RequestOptions,
): PagePromise<MessagesPage, Message> {
    return ai.beta.threads.messages.list(
        threadId,
        { order: "asc", ...query },
        options,
    );
}

export function createPrismaThread(
    userId: string,
    threadId: string,
    name: string,
    assistantId: string,
) {
    return prisma.thread.create({
        data: {
            userId,
            oId: threadId,
            name,
            slug: kebab(name),
            assistantId,
        },
    });
}

export function createPrismaBareThread(
    userId: string,
    threadId: string,
    assistantId: string,
) {
    return prisma.thread.create({
        data: {
            userId,
            oId: threadId,
            assistantId,
        },
    });
}

export function createBareThread() {
    return ai.beta.threads.create();
}

export function createThread(
    content: string,
    metadata?: Record<string, unknown>,
) {
    return ai.beta.threads.create({
        messages: [
            {
                role: "user",
                content,
            },
        ],
        metadata,
    });
}

export async function hasThreadName(id: string) {
    const thread = await prisma.thread.findUnique({
        where: {
            id,
        },
    });

    return !!thread?.name;
}

export function updatePrismaThread(id: string, name: string) {
    return prisma.thread.update({
        where: {
            id,
        },
        data: {
            name,
            slug: kebab(name),
        },
    });
}

export function updateThread(id: string, metadata?: Record<string, unknown>) {
    return ai.beta.threads.update(id, {
        metadata,
    });
}

export async function updateThreadTitle(
    title: string,
    threadId: string,
    prismaThreadId: string,
) {
    const completion = await createCompletion(title, {
        schema: ThreadTitleSchema,
        schemaTitle: "ThreadTitle",
    });

    const content = completion.choices.at(0)?.message.content;
    const parsed = JSON.parse(content!);

    await updateThread(threadId, {
        name: parsed.title,
    });

    await updatePrismaThread(prismaThreadId, parsed.title);

    return parsed.title;
}

export function deletePrismaThread(id: string) {
    return prisma.thread.delete({
        where: {
            id,
        },
    });
}

export function deleteThread(id: string) {
    return ai.beta.threads.del(id);
}
