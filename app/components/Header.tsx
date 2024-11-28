import { Link, NavLink, NavLinkRenderProps } from "react-router";
import { Paths } from "~/utils/paths";

export default function Header() {
    const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
        `${isActive ? "bg-primary-500" : "bg-zinc-500"} p-2 rounded-xl`;

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
                        <NavLink
                            to={Paths.DASHBOARD}
                            className={navLinkClassName}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
