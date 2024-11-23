import { Outlet } from 'react-router';
import { Route } from './+types/restricted';
import { requireUserId } from '~/utils/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
    await requireUserId(request);

    return null;
}

export default function Restricted() {
    return <Outlet />;
}
