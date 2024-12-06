import { Outlet } from "react-router";

import { Heading } from "~/components/Heading";

export default function Threads() {
    return (
        <div className="px-4">
            <Heading>Threads</Heading>
            <Outlet />
        </div>
    );
}
