import { File } from "@prisma/client";
import { FilePurpose } from "openai/resources/files.mjs";
import { Uploadable } from "openai/uploads.mjs";
import { prisma } from "~/db.server";

import { ai } from "~/open-ai";

export function getFiles() {
    return ai.files.list();
}

export function getFile(fileId: string) {
    return ai.files.retrieve(fileId);
}

export function getUserFiles(userId: string) {
    return prisma.file.findMany({
        where: {
            userId,
        },
    });
}

export function createFile(
    file: Uploadable,
    purpose: FilePurpose = "assistants",
) {
    return ai.files.create({
        file,
        purpose,
    });
}

export function createPrismaFile({
    oId,
    name,
    slug,
    userId,
}: Pick<File, "oId" | "name" | "slug" | "userId">) {
    return prisma.file.create({
        data: {
            name,
            slug,
            oId,
            userId,
        },
    });
}

export function deleteFile(fileId: string) {
    return ai.files.del(fileId);
}
