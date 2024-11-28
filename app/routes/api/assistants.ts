import { data, redirect } from "react-router";
import { createVectorStore } from "~/models/vectorStore.server";
import {
    createAssistant,
    createPrismaAssistant,
} from "~/models/assistant.server";
import { kebab } from "~/utils/string";
import invariant from "tiny-invariant";
import { getUserId } from "~/utils/auth.server";
import { Paths } from "~/utils/paths";
import { Route } from "./+types/assistants";

export async function action({ request }: Route.ActionArgs) {
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
            await createPrismaAssistant(name, assistant.id, userId);
            await createVectorStore(kebab(`${assistant.name} store`));

            return redirect(Paths.DASHBOARD);
        } catch (error) {
            if (error instanceof Error) {
                throw Error(error.message);
            }
        }
    }

    return data({ message: "Invalid" }, 405);
}
