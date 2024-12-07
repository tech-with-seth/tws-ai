import { Outlet } from "react-router";

import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { getUserRole, requireUserId } from "~/utils/auth.server";
import { Route } from "./+types/restricted";

export async function loader({ request }: Route.LoaderArgs) {
    await requireUserId(request);
    const role = await getUserRole(request);

    return { isAdmin: role === "ADMIN" };
}

export default function Restricted({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex h-full flex-col">
            <Header isAdmin={loaderData.isAdmin} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
