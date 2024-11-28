import { getUserId } from "~/utils/auth.server";
import { Route } from "./+types/threads";
import {
    createBareThread,
    createPrismaBareThread,
    updatePrismaThread,
    updateThread,
} from "~/models/thread.server";
import { data, redirect } from "react-router";
import invariant from "tiny-invariant";
import { getChatPath } from "~/utils/paths";
import { createCompletion } from "~/models/completion.server";
import { getPrismaAssistantByOpenId } from "~/models/assistant.server";

export async function action({ request }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID does not exist");

    if (request.method === "POST") {
        const form = await request.formData();
        const assistantId = String(form.get("assistantId"));
        const prismaAssistant = await getPrismaAssistantByOpenId(assistantId);
        invariant(prismaAssistant, "Prisma Assistant not found");

        const thread = await createBareThread();
        await createPrismaBareThread(userId, thread.id, prismaAssistant.id);

        return redirect(getChatPath(assistantId, thread.id));
    }

    if (request.method === "PUT") {
        const form = await request.formData();
        const name = String(form.get("name"));
        const threadId = String(form.get("threadId"));
        const prismaThreadId = String(form.get("prismaThreadId"));

        const completion = await createCompletion(name);

        const [firstChoice] = completion.choices;
        const titleJson = firstChoice.message.content;
        const parsed = JSON.parse(titleJson!);

        await updateThread(threadId, {
            name: parsed.title,
        });

        await updatePrismaThread(prismaThreadId, parsed.title);
    }

    return data({ message: "Invalid" }, 405);
}
