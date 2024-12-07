import { data, redirect } from "react-router";
import invariant from "tiny-invariant";

import { getUserId } from "~/utils/auth.server";
import { Route } from "./+types/files";
import { kebab } from "~/utils/string";
import {
    addFileToVectorStore,
    getOrCreateVectorStore,
} from "~/models/vectorStore.server";
import { createFile, createPrismaFile } from "~/models/file.server";
import { Paths } from "~/utils/paths";

export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const userId = await getUserId(request);
    invariant(userId, "User ID is required");

    if (request.method === "POST") {
        const content = String(form.get("content"));
        const assistantId = String(form.get("assistantId"));
        const fileName = String(form.get("fileName"));
        const intent = String(form.get("intent"));

        if (intent === "createFile") {
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
            await createPrismaFile({
                userId,
                oId: createdFile.id,
                name: fileName,
                slug: kebab(fileName),
            });

            // add file to vector store
            await addFileToVectorStore(vectorStoreId, createdFile.id);

            return redirect(Paths.DASHBOARD);
        }

        if (intent === "uploadFiles") {
            form.getAll("file").forEach(async (entry) => {
                if (entry instanceof File) {
                    const vectorStoreId =
                        await getOrCreateVectorStore(assistantId);

                    // upload using the file stream
                    const createdFile = await createFile(entry, "assistants");

                    // add file to vector store
                    await addFileToVectorStore(vectorStoreId, createdFile.id);
                }
            });

            return redirect(Paths.DASHBOARD);
        }

        return data({ message: "Invalid" }, 405);
    }
}
