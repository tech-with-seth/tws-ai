import { Outlet } from 'react-router';

import { Heading } from '~/components/Heading';

export default function Assistants() {
    return (
        <div className="px-4">
            <Heading>Assistants</Heading>
            <Outlet />
        </div>
    );
}
