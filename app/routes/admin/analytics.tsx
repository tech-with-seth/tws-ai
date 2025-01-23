import { getThreadCount } from "~/models/thread.server";
import { getUserCount } from "~/models/user.server";
import { getAssistantCount } from "~/models/assistant.server";
import { getActivityLogCount } from "~/models/activity.server";
import { getCompanyCount } from "~/models/company.server";
import { getProfileCount } from "~/models/profile.server";
import { getFileCount } from "~/models/file.server";
import { Heading } from "~/components/Heading";
import { Route } from "../admin/+types/analytics";

export async function loader() {
    return {
        assistantCount: await getAssistantCount(),
        activityLogCount: await getActivityLogCount(),
        companyCount: await getCompanyCount(),
        profileCount: await getProfileCount(),
        fileCount: await getFileCount(),
        threadCount: await getThreadCount(),
        userCount: await getUserCount(),
    };
}

export default function AnalyticsRoute({ loaderData }: Route.ComponentProps) {
    return (
        <div className="p-4">
            <Heading as="h1" className="mb-8 text-6xl font-bold">
                Analytics
            </Heading>
            <div className="col-span-6 flex flex-col gap-4">
                <Heading as="h4" className="font-thin">
                    Assistants:{" "}
                    <span className="font-bold">
                        {loaderData.assistantCount}
                    </span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Companies:{" "}
                    <span className="font-bold">{loaderData.companyCount}</span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Files:{" "}
                    <span className="font-bold">{loaderData.fileCount}</span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Logs:{" "}
                    <span className="font-bold">
                        {loaderData.activityLogCount}
                    </span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Profiles:{" "}
                    <span className="font-bold">{loaderData.profileCount}</span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Threads:{" "}
                    <span className="font-bold">{loaderData.threadCount}</span>
                </Heading>
                <Heading as="h4" className="font-thin">
                    Users:{" "}
                    <span className="font-bold">{loaderData.userCount}</span>
                </Heading>
            </div>
        </div>
    );
}
