import { getUserId } from "~/utils/auth.server";
import { Route } from "./+types/threads";
import {
    createBareThread,
    createPrismaThread,
    createThread,
    createThreadAndRun,
    updatePrismaThread,
    updateThread,
} from "~/models/thread.server";
import { data, redirect } from "react-router";
import invariant from "tiny-invariant";
import { getChatPath } from "~/utils/paths";
import {
    createCompletion,
    ThreadTitleSchema,
} from "~/models/completion.server";
import { getPrismaAssistantByOpenId } from "~/models/assistant.server";
import { ChatCompletion } from "openai/resources/index.mjs";

const extractTitle = (completion: ChatCompletion) => {
    const first = completion.choices.at(0);
    const titleJson = first?.message.content;
    const parsed = JSON.parse(titleJson!);

    return parsed.title;
};

export async function action({ request }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID does not exist");

    if (request.method === "POST") {
        const form = await request.formData();
        const assistantId = String(form.get("assistantId"));

        const prompt = String(form.get("prompt"));
        invariant(prompt, "Prompt not found");

        const prismaAssistant = await getPrismaAssistantByOpenId(assistantId);
        invariant(prismaAssistant, "Prisma Assistant not found");

        const completion = await createCompletion(prompt, {
            schema: ThreadTitleSchema,
            schemaTitle: "ThreadTitle",
        });

        const title = extractTitle(completion);

        const thread = await createThread(prompt);

        const prismaThread = await createPrismaThread(
            userId,
            thread.id,
            title,
            prismaAssistant.id,
        );

        return redirect(`${getChatPath(prismaThread.slug!)}?static=true`);
    }

    if (request.method === "PUT") {
        const form = await request.formData();
        // TODO: Update variable naming, call site uses name, I want it to be "prompt"
        const name = String(form.get("name"));
        const threadId = String(form.get("threadId"));
        const prismaThreadId = String(form.get("prismaThreadId"));

        const completion = await createCompletion(name, {
            schema: ThreadTitleSchema,
            schemaTitle: "ThreadTitle",
        });

        const title = extractTitle(completion);

        await updateThread(threadId, {
            name: title,
        });

        await updatePrismaThread(prismaThreadId, title);

        return data({ message: "Success" }, 200);
    }

    return data({ message: "Invalid" }, 405);
}
