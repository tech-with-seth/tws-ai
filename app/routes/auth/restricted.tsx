import { requireUserId } from "~/utils/auth.server";
import { Route } from "./+types/restricted";

export async function loader({ request }: Route.LoaderArgs) {
    await requireUserId(request);
}
