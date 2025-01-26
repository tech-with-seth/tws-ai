import {
    deleteAssistant,
    deletePrismaAssistant,
    getAssistants,
    getPrismaAssistants,
} from "~/models/assistant.server";
import { Route } from "../admin/+types/data";
import { Heading } from "~/components/Heading";
import { Card } from "~/components/Card";
import { Button } from "~/components/Button";
import { TrashIcon } from "lucide-react";
import { redirect, useFetcher } from "react-router";
import { deleteUser, getUsersWithRole } from "~/models/user.server";
import { Details } from "~/components/Details";
import { deleteCompany, getCompanies } from "~/models/company.server";
import { deleteProfile, getProfiles } from "~/models/profile.server";
import {
    deleteFile,
    deletePrismaFile,
    getFiles,
    getPrismaFiles,
} from "~/models/file.server";
import { deletePrismaThread, getPrismaThreads } from "~/models/thread.server";
import { getUser } from "~/utils/auth.server";
import { cache } from "~/utils/cache";

export async function loader({ request }: Route.LoaderArgs) {
    const user = await getUser(request);

    if (!user?.email.toLowerCase().includes("seth")) {
        return redirect("/admin");
    }

    return {
        assistants: await getAssistants(),
        prismaAssistants: await getPrismaAssistants(),
        companies: await getCompanies(),
        files: await getFiles(),
        prismaFiles: await getPrismaFiles(),
        profiles: await getProfiles(),
        prismaThreads: await getPrismaThreads(),
        users: await getUsersWithRole("USER"),
    };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
    if (cache.getKey("dbData")) {
        return cache.getKey("dbData") as Awaited<
            ReturnType<typeof serverLoader>
        >;
    } else {
        const freshDbData = await serverLoader();
        cache.set("dbData", freshDbData);
        cache.save();

        return freshDbData;
    }
}

clientLoader.hydrate = true;

export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const intent = form.get("intent");

    if (intent === "deleteAllUsers") {
        const allUsers = await getUsersWithRole("USER");
        await Promise.all(allUsers.map((user) => deleteUser(user.id)));
    }

    if (intent === "deleteAllAssistants") {
        const allAssistants = await getAssistants();
        await Promise.all(
            allAssistants.data.map((assistant) =>
                deleteAssistant(assistant.id),
            ),
        );

        const allPrismaAssistants = await getPrismaAssistants();
        await Promise.all(
            allPrismaAssistants.map((assistant) =>
                deletePrismaAssistant(assistant.id),
            ),
        );
    }

    if (intent === "deleteAllCompanies") {
        const allCompanies = await getCompanies();
        await Promise.all(
            allCompanies.map((comapny) => deleteCompany(comapny.id)),
        );
    }

    if (intent === "deleteAllFiles") {
        const allFiles = await getFiles();
        await Promise.all(allFiles.data.map((file) => deleteFile(file.id)));

        const allPrismaFiles = await getPrismaFiles();
        await Promise.all(
            allPrismaFiles.map((file) => deletePrismaFile(file.id)),
        );
    }

    if (intent === "deleteAllProfiles") {
        const allProfiles = await getProfiles();
        await Promise.all(
            allProfiles.map((profile) => deleteProfile(profile.id)),
        );
    }

    if (intent === "deleteAllThreads") {
        const allThreads = await getPrismaThreads();
        // await Promise.all(allThreads.map((thread) => deleteThread(thread.oId)));
        await Promise.all(
            allThreads.map((thread) => deletePrismaThread(thread.id)),
        );
    }

    return null;
}

const DataBlock = ({
    id,
    heading,
    items,
    showKey,
}: {
    id: string;
    heading: string;
    items: any[];
    showKey: string;
}) => {
    const dataBlockFetcher = useFetcher({ key: `${id}-${showKey}` });

    return (
        <div>
            <div className="flex gap-4">
                <Heading className="mb-4">{heading}</Heading>
                <dataBlockFetcher.Form method="DELETE">
                    <Button
                        color="danger"
                        name="intent"
                        value="deleteAllUsers"
                        type="submit"
                    >
                        Delete all {items.length} {heading.toLowerCase()}
                    </Button>
                </dataBlockFetcher.Form>
            </div>
            <Details text="Show all">
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li key={item.id}>
                            <Card className="flex items-center justify-between">
                                <div>{item[showKey]}</div>
                                <div>
                                    <dataBlockFetcher.Form method="DELETE">
                                        <Button
                                            color="danger"
                                            name="userId"
                                            value={item.id}
                                            type="submit"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </dataBlockFetcher.Form>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Details>
        </div>
    );
};

export default function DataRoute({ loaderData }: Route.ComponentProps) {
    return (
        <div className="space-y-4 p-4">
            <Heading as="h1" className="mb-8 text-6xl font-bold">
                Data
            </Heading>
            <DataBlock
                id="users"
                heading="Users"
                items={loaderData.users}
                showKey="email"
            />
            <DataBlock
                id="assistants"
                heading="Assistants"
                items={loaderData.prismaAssistants}
                showKey="name"
            />
            <DataBlock
                id="companies"
                heading="Companies"
                items={loaderData.companies}
                showKey="name"
            />
            <DataBlock
                id="profiles"
                heading="Profiles"
                items={loaderData.profiles}
                showKey="firstName"
            />
            <DataBlock
                id="files"
                heading="Files"
                items={loaderData.prismaFiles}
                showKey="fileName"
            />
            <DataBlock
                id="threads"
                heading="Threads"
                items={loaderData.prismaThreads}
                showKey="name"
            />
        </div>
    );
}
