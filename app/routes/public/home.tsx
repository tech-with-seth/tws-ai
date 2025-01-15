import { Link } from "react-router";

import { ExternalLink } from "~/components/ExternalLink";
import { Paths } from "~/utils/paths";
import { ArrowRightCircle } from "lucide-react";
import { Route } from "./+types/home";
import { client } from "~/sanity-client";
import { blocksToText } from "~/utils/common";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "TWS AI" },
        { name: "description", content: "Welcome to TWS AI!" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const article = await client.fetch(
        '*[_type == "article" && title == "AI Agents Get Things Done"]',
    );

    return {
        article: article[0],
    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <>
            <div className="flex h-full flex-col items-center justify-center gap-12">
                <div className="text-center">
                    <h2 className="text-md lg:text-2xl">
                        Supercharge your productivity with
                    </h2>
                    <h1 className="mb-4 text-2xl font-bold lg:text-8xl">
                        AI Assistants
                    </h1>
                    <p>
                        Built by{" "}
                        <ExternalLink href="https://sethdavis.tech">
                            Tech with Seth
                        </ExternalLink>
                    </p>
                </div>
                <div>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <Link
                                to={Paths.DASHBOARD}
                                className="inline-flex items-center gap-2 text-4xl"
                            >
                                Get started{" "}
                                <ArrowRightCircle className="h-8 w-8" />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="max-w-[640px]">
                        {blocksToText(loaderData.article.details)}
                    </p>
                </div>
            </div>
        </>
    );
}
