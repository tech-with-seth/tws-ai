import { Outlet } from "react-router";

import { Heading } from "~/components/Heading";
import { InternalLink } from "~/components/InternalLink";

export default function AssistantsIndexRoute() {
    return (
        <div className="p-4">
            <div className="mb-8 border-b dark:border-zinc-600">
                <Heading className="mb-4">Assistants</Heading>
            </div>
            <div className="flex gap-8">
                <div className="basis-2/12">
                    <ul className="space-y-4">
                        <li>
                            <InternalLink to="/assistants" end>
                                {"View all"}
                            </InternalLink>
                        </li>
                        <li>
                            <InternalLink to="/assistants/create">
                                {"Create assistant"}
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
