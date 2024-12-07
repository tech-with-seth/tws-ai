import { Link, NavLink, NavLinkRenderProps } from "react-router";
import { Paths } from "~/utils/paths";
import { ButtonNavLink } from "~/components/ButtonNavLink";

interface HeaderProps {
    isAdmin: boolean;
}

export function Header({ isAdmin }: HeaderProps) {
    return (
        <header className="mb-4 p-4">
            <nav className="flex items-center justify-between rounded-xl bg-zinc-300 p-4 dark:bg-zinc-800">
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
                        <li>
                            <ButtonNavLink to={Paths.LABS}>Labs</ButtonNavLink>
                        </li>
                    )}
                </ul>
                <ul className="flex items-center gap-2">
                    <li>
                        <ButtonNavLink to={Paths.LOGOUT}>Logout</ButtonNavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
