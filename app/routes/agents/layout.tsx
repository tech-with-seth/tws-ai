import { Outlet } from "react-router";

import { Heading } from "~/components/Heading";
import { InternalLink } from "~/components/InternalLink";

export default function AgentsIndexRoute() {
    return (
        <div className="p-4">
            <div className="mb-8 border-b dark:border-zinc-600">
                <Heading className="mb-4">Agents</Heading>
            </div>
            <div className="flex gap-8">
                <div className="basis-2/12">
                    <ul className="space-y-4">
                        <li>
                            <InternalLink to="/agents" end>
                                {"View all"}
                            </InternalLink>
                        </li>
                        <li>
                            <InternalLink to="/agents/create">
                                {"Create agent"}
                            </InternalLink>
                        </li>
                    </ul>
                </div>
                <div className="basis-10/12">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
