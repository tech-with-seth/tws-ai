import { Link } from 'react-router';
import { Paths } from '~/utils/paths';

export default function Header() {
    return (
        <header className="border-b border-b-zinc-500 dark:border-b-zinc-500 mb-4">
            <div className="container">
                <nav className="p-4">
                    <ul>
                        <li>
                            <Link to={Paths.BASE}>TWS AI</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
