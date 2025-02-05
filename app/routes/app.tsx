import { Outlet, redirect } from "react-router";
import invariant from "tiny-invariant";

import { getUser } from "~/utils/auth.server";
import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { Route } from "./+types/app";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await getUser(request);
    const userId = user?.id;

    if (!userId) {
        return redirect("/login");
    }

    invariant(userId, "User ID is not defined");

    return {
        isAdmin: user?.role === "ADMIN",
        user,
    };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex h-full flex-col">
            <Header
                isAdmin={loaderData.isAdmin}
                user={loaderData.user ?? undefined}
            />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
