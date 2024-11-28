import { Outlet } from "react-router";
import { Route } from "./+types/restricted";
import { requireUserId } from "~/utils/auth.server";
import Header from "~/components/Header";
import { Footer } from "~/components/Footer";

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
