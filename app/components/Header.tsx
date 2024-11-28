import { Link, NavLink, NavLinkRenderProps } from "react-router";
import { Paths } from "~/utils/paths";
import { ButtonNavLink } from "./ButtonNavLink";

export default function Header() {
    return (
        <header className="mb-4 p-4">
            <nav className="flex items-center rounded-xl bg-zinc-300 p-4 dark:bg-zinc-800">
                <ul className="mr-4 flex items-center gap-4">
                    <li>
                        <Link to={Paths.DASHBOARD} className="font-bold">
                            TWS AI
                        </Link>
                    </li>
                </ul>
                <ul className="flex items-center gap-2">
                    <li>
                        <ButtonNavLink to={Paths.DASHBOARD}>
                            Dashboard
                        </ButtonNavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
