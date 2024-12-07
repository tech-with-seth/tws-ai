import { Outlet } from "react-router";

import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { requireUserId } from "~/utils/auth.server";
import { Route } from "../+types/restricted";

export async function loader({ request }: Route.LoaderArgs) {
    await requireUserId(request);

    return null;
}

export default function Restricted() {
    return (
        <div className="flex h-full flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
