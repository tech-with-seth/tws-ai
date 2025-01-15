import { logout } from "~/utils/auth.server";
import { Route } from "./+types/logout";
import { cache } from "~/utils/cache";

export async function loader({ request }: Route.LoaderArgs) {
    cache.destroy();

    return await logout(request);
}
