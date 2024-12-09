import { data, redirect } from "react-router";
import { createVectorStore } from "~/models/vectorStore.server";
import {
    createAssistant,
    createPrismaAssistant,
    deleteAssistant,
    deletePrismaAssistant,
    getPrismaAssistantByOpenId,
    updateAssistantVectorStore,
} from "~/models/assistant.server";
import { kebab } from "~/utils/string";
import invariant from "tiny-invariant";
import { getUserId } from "~/utils/auth.server";
import { Paths } from "~/utils/paths";
import { Route } from "./+types/assistants";

export async function action({ request, params }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID is undefined");

    if (request.method === "POST") {
        try {
            const form = await request.formData();
            const name = String(form.get("name"));
            invariant(name, "Name is undefined");

            const instructions = String(form.get("instructions"));
            invariant(instructions, "Instructions is undefined");

            const assistant = await createAssistant(name, instructions);
            const vectorStore = await createVectorStore(
                kebab(`${assistant.name} store`),
            );

            await createPrismaAssistant(
                name,
                assistant.id,
                userId,
                vectorStore.id,
            );
            await updateAssistantVectorStore(assistant.id, vectorStore.id);

            return redirect(Paths.DASHBOARD);
        } catch (error) {
            if (error instanceof Error) {
                throw Error(error.message);
            }

            return data({ message: "Error occurred" }, 500);
        }
    }

    if (request.method === "DELETE") {
        const form = await request.formData();
        const assistantId = String(form.get("assistantId"));
        invariant(assistantId, "Assistant ID is undefined");

        try {
            const prismaAssistant =
                await getPrismaAssistantByOpenId(assistantId);
            invariant(prismaAssistant, "getPrismaAssistantByOpenId failed");

            await deleteAssistant(assistantId);
            await deletePrismaAssistant(prismaAssistant.id);

            return data({ message: "Assistant deleted" }, 200);
        } catch (error) {
            if (error instanceof Error) {
                throw Error(error.message);
            }

            return data({ message: "Error occurred" }, 500);
        }
    }

    return data({ message: "Invalid" }, 405);
}
