import { Link } from "react-router";
import { Paths } from "~/utils/paths";
import { ButtonNavLink } from "~/components/ButtonNavLink";
import { FlaskConicalIcon, LampDeskIcon } from "lucide-react";
import { User } from "@prisma/client";

interface HeaderProps {
    isAdmin: boolean;
    user?: Pick<User, "email">;
}

export function Header({ isAdmin, user }: HeaderProps) {
    return (
        <header className="mb-4 p-4">
            <nav className="flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-300 p-4 dark:border-zinc-600 dark:bg-zinc-700">
                <ul className="mr-4 flex items-center gap-4">
                    <li>
                        <Link to={Paths.DASHBOARD} className="font-bold">
                            TWS AI
                        </Link>
                    </li>
                    <li>
                        <ButtonNavLink to={Paths.DASHBOARD}>
                            Dashboard
                        </ButtonNavLink>
                    </li>
                    {isAdmin && (
                        <>
                            <li>
                                <ButtonNavLink
                                    iconBefore={
                                        <LampDeskIcon className="h-4 w-4" />
                                    }
                                    to={Paths.STUDIO}
                                >
                                    Studio
                                </ButtonNavLink>
                            </li>
                            <li>
                                <ButtonNavLink
                                    iconBefore={
                                        <FlaskConicalIcon className="h-4 w-4" />
                                    }
                                    to={Paths.LABS}
                                >
                                    Labs
                                </ButtonNavLink>
                            </li>
                        </>
                    )}
                </ul>
                <ul className="flex items-center gap-4">
                    <li>{user?.email}</li>
                    <li>
                        <ButtonNavLink to={Paths.LOGOUT}>Logout</ButtonNavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
