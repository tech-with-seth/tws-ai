import type { Route } from "./+types/home";

import { ButtonLink } from "~/components/ButtonLink";
import ExternalLink from "~/components/ExternalLink";
import { Paths } from "~/utils/paths";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "TWS AI" },
        { name: "description", content: "Welcome to TWS AI!" },
    ];
}

export default function Home() {
    return (
        <>
            <div className="flex h-full flex-col items-center justify-center gap-12">
                <div className="text-center">
                    <h2 className="text-2xl">
                        Supercharge your productivity with
                    </h2>
                    <h1 className="mb-4 text-8xl font-bold">AI Assistants</h1>
                    <p className="block">
                        Built by{" "}
                        <ExternalLink href="https://sethdavis.tech">
                            Tech with Seth
                        </ExternalLink>
                    </p>
                </div>
                <div>
                    <ul className="flex gap-4">
                        <li>
                            <ButtonLink to={Paths.DASHBOARD}>
                                Dashboard
                            </ButtonLink>
                        </li>
                        <li>
                            <ButtonLink
                                variant="secondary"
                                to={Paths.DASHBOARD}
                            >
                                Settings
                            </ButtonLink>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
