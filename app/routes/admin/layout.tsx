import { ArrowLeftIcon } from "lucide-react";
import { Link, Outlet } from "react-router";
import { ButtonNavLink } from "~/components/ButtonNavLink";
import { Paths } from "~/utils/paths";

export default function AdminRoute() {
    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-b-zinc-400 bg-gradient-to-r from-zinc-100 to-zinc-300 p-4 dark:border-b-zinc-700 dark:from-zinc-700 dark:to-zinc-900">
                <Link
                    to={Paths.DASHBOARD}
                    className="flex items-center gap-2 underline hover:text-primary-500 dark:hover:text-primary-400"
                >
                    <ArrowLeftIcon className="block" />
                    Back to Dashboard
                </Link>
            </div>
            <div className="flex gap-2 border-b border-b-zinc-400 p-4 dark:border-b-zinc-700">
                <ButtonNavLink to="admin/labs">Labs</ButtonNavLink>
                <ButtonNavLink to="admin/analytics">Analytics</ButtonNavLink>
                <ButtonNavLink to="admin/studio">Studio</ButtonNavLink>
                <ButtonNavLink to="admin/ui">UI</ButtonNavLink>
            </div>
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    );
}
