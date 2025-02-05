import { File as FileType } from "@prisma/client";
import { FilePurpose } from "openai/resources/files.mjs";
import { Uploadable } from "openai/uploads.mjs";
import { prisma } from "~/db.server";

import { ai } from "~/open-ai";
import { kebab } from "~/utils/string";
import {
    addFileToVectorStore,
    getOrCreateVectorStore,
} from "./vectorStore.server";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export function getFileCount() {
    return prisma.file.count();
}

export function getFiles() {
    return ai.files.list();
}

export function getPrismaFiles() {
    return prisma.file.findMany();
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
}: Pick<FileType, "oId" | "name" | "slug" | "userId">) {
    return prisma.file.create({
        data: {
            name,
            slug,
            oId,
            userId,
        },
    });
}

export function deleteFile(id: string) {
    return ai.files.del(id);
}

export function deletePrismaFile(id: string) {
    return prisma.file.delete({
        where: {
            id,
        },
    });
}

export async function createFileAndAddToVectorStore({
    assistantId,
    content,
    fileName,
}: {
    assistantId: string;
    content: string;
    fileName: string;
}) {
    const type = "text/plain";
    const jsonBlob = new Blob([content], {
        type,
    });
    const file = new File([jsonBlob], `${kebab(fileName)}.txt`, {
        type,
        lastModified: Date.now(),
    });
    const vectorStoreId = await getOrCreateVectorStore(assistantId);

    // upload using the file stream
    const createdFile = await createFile(file, "assistants");
    // await createPrismaFile({
    //     userId,
    //     oId: createdFile.id,
    //     name: fileName,
    //     slug: kebab(fileName),
    // });

    // add file to vector store
    await addFileToVectorStore(vectorStoreId, createdFile.id);

    return { success: true };
}
