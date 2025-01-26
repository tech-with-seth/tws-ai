import { TriggerAuthContext } from "@trigger.dev/react-hooks";
import { ArrowLeftIcon } from "lucide-react";
import { Link, Outlet } from "react-router";
import { ButtonNavLink } from "~/components/ButtonNavLink";
import { Paths } from "~/utils/paths";
import { Route } from "../admin/+types/layout";
import { auth } from "@trigger.dev/sdk/v3";

const TASK_ID = "document-updater";

export async function loader() {
    const publicToken = await auth.createPublicToken({
        scopes: {
            read: {
                tasks: [TASK_ID],
            },
            trigger: {
                tasks: [TASK_ID],
            },
        },
    });

    return {
        publicToken,
    };
}

export default function AdminRoute({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex gap-8 border-b border-b-zinc-400 p-4 dark:border-b-zinc-700 dark:bg-zinc-900">
                <Link
                    to={Paths.DASHBOARD}
                    className="flex items-center gap-2 underline hover:text-primary-500 dark:hover:text-primary-400"
                >
                    <ArrowLeftIcon className="block" />
                    Back to Dashboard
                </Link>
                <div className="flex gap-2">
                    <ButtonNavLink size="sm" to="admin/labs">
                        Labs
                    </ButtonNavLink>
                    <ButtonNavLink size="sm" to="admin/analytics">
                        Analytics
                    </ButtonNavLink>
                    <ButtonNavLink size="sm" to="admin/data">
                        Data
                    </ButtonNavLink>
                    <ButtonNavLink size="sm" to="admin/studio">
                        Studio
                    </ButtonNavLink>
                    <ButtonNavLink size="sm" to="admin/ui">
                        UI
                    </ButtonNavLink>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <TriggerAuthContext.Provider
                    value={{ accessToken: loaderData.publicToken }}
                >
                    <Outlet />
                </TriggerAuthContext.Provider>
            </div>
        </div>
    );
}
