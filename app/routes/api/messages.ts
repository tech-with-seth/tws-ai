import { createMessage, createPrismaMessage } from "~/models/message.server";
import { Route } from "../api/+types/messages";
import invariant from "tiny-invariant";
import { getUserId } from "~/utils/auth.server";
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
    if (request.method === "POST") {
        const userId = await getUserId(request);
        invariant(userId, "User ID is required");
        const form = await request.formData();

        const content = String(form.get("content"));
        invariant(content, "Content is required to create a message");
        const threadId = String(form.get("threadId"));
        invariant(threadId, "ThreadId is required to create a message");

        const message = await createMessage({ content, threadId });
        await createPrismaMessage({
            content,
            oId: message.id,
            role: "USER",
            threadId,
            userId,
        });
    }

    return data({ message: "Invalid method" }, 405);
}
