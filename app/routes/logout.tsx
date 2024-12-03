import { logout } from "~/utils/auth.server";
import { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
    return await logout(request);
}
