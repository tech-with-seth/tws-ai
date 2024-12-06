import { data } from "react-router";
import { Route } from "./+types/thread";
import { deletePrismaThread, getThreadByOpenId } from "~/models/thread.server";
import { deleteThreadPath } from "~/utils/paths";
import invariant from "tiny-invariant";

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method === "DELETE") {
        const { threadId } = params;

        const retrieved = await getThreadByOpenId(threadId);
        invariant(retrieved, "Thread not found");

        await deleteThreadPath(retrieved.oId);
        await deletePrismaThread(retrieved.id);
    }

    return data({ message: "Invalid" }, 405);
}
