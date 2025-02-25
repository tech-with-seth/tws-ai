import { getUserId } from "~/utils/auth.server";
import { Route } from "./+types/threads";
import {
    createBareThread,
    createPrismaBareThread,
    deletePrismaThread,
    getThreadByOpenId,
    updatePrismaThread,
    updateThread,
} from "~/models/thread.server";
import { data, redirect } from "react-router";
import invariant from "tiny-invariant";
import { deleteThreadPath, getChatPath } from "~/utils/paths";
import { createCompletion } from "~/models/completion.server";
import { getPrismaAssistantByOpenId } from "~/models/assistant.server";
import { createLog } from "~/models/activity.server";
import { ThreadTitleSchema } from "~/utils/schemas";

export async function action({ request, params }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID does not exist");

    if (request.method === "POST") {
        const form = await request.formData();
        const assistantId = String(form.get("assistantId"));
        const prismaAssistant = await getPrismaAssistantByOpenId(assistantId);
        invariant(prismaAssistant, "Prisma Assistant not found");

        const thread = await createBareThread();
        await createPrismaBareThread(userId, thread.id, prismaAssistant.id);

        await createLog({
            userId,
            action: "CREATE_THREAD",
            meta: {
                api: true,
                threadId: thread.id,
                assistantId: prismaAssistant.id,
            },
        });

        return redirect(getChatPath(assistantId, thread.id));
    }

    if (request.method === "PUT") {
        const form = await request.formData();
        const name = String(form.get("name"));
        const threadId = String(form.get("threadId"));
        const prismaThreadId = String(form.get("prismaThreadId"));

        const completion = await createCompletion(name, {
            schema: ThreadTitleSchema,
            schemaTitle: "ThreadTitle",
        });

        const first = completion.choices.at(0);
        const titleJson = first?.message.content;
        const parsed = JSON.parse(titleJson!);

        await updateThread(threadId, {
            name: parsed.title,
        });

        await updatePrismaThread(prismaThreadId, parsed.title);

        await createLog({
            userId,
            action: "UPDATE_THREAD",
            meta: {
                api: true,
                threadId: prismaThreadId,
                title: parsed.title,
            },
        });

        return data({ message: "Success" }, 200);
    }

    if (request.method === "DELETE") {
        const { threadId } = params;
        invariant(threadId, "Thread ID not found");

        const retrieved = await getThreadByOpenId(threadId);
        invariant(retrieved, "Thread not found");

        await deleteThreadPath(retrieved.oId);
        await deletePrismaThread(retrieved.id);

        return data({ message: "Deleted" }, 200);
    }

    return data({ message: "Invalid" }, 405);
}
