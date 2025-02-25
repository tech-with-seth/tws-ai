import { Message } from "@prisma/client";
import { prisma } from "~/db.server";
import { ai } from "~/open-ai";

export function createMessage({
    content,
    metadata,
    threadId,
}: {
    content: string;
    threadId: string;
    metadata?: unknown;
}) {
    return ai.beta.threads.messages.create(threadId, {
        role: "user",
        content,
        metadata,
    });
}

export function createPrismaMessage({
    content,
    oId,
    role,
    threadId,
    userId,
}: {
    content: string;
    oId: string;
    role: Message["role"];
    threadId: string;
    userId: string;
}) {
    return prisma.message.create({
        data: {
            content,
            oId,
            role,
            threadId,
            userId,
        },
    });
}
