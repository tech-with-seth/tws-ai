import { Link, NavLink, NavLinkRenderProps } from 'react-router';
import { Paths } from '~/utils/paths';

export default function Header() {
    const navLinkClassName = ({ isActive }: NavLinkRenderProps) =>
        `${isActive ? 'bg-primary-500' : 'bg-zinc-500'} p-2 rounded-lg`;

    return (
        <header className="p-4">
            <nav className="flex items-center p-4 bg-zinc-300 dark:bg-zinc-800 rounded-xl">
                <ul className="flex items-center gap-4 mr-4">
                    <li>
                        <Link to={Paths.DASHBOARD}>TWS AI</Link>
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
