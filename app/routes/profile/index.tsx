import { Form } from "react-router";
import invariant from "tiny-invariant";

import {
    createProfileForUser,
    getProfileByUserId,
} from "~/models/profile.server";
import { Route } from "../profile/+types/index";
import { getUserId } from "~/utils/auth.server";
import { Button } from "~/components/Button";

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID not found");

    return {
        profile: await getProfileByUserId(userId),
    };
}

export async function action({ request }: Route.ActionArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID not found");

    await createProfileForUser({
        userId,
        firstName: "John",
        lastName: "Doe",
    });

    return null;
}

export default function ProfileIndexRoute({
    loaderData,
}: Route.ComponentProps) {
    return (
        <div className="p-4">
            {loaderData.profile && (
                <>
                    <p>
                        <strong>Name:</strong> {loaderData.profile.firstName}{" "}
                        {loaderData.profile.lastName}
                    </p>
                    <p>
                        <strong>Bio:</strong> {loaderData.profile.bio ?? "None"}
                    </p>
                    <p>
                        <strong>Location:</strong> {loaderData.profile.location}
                    </p>
                    <p>
                        <strong>Website:</strong> {loaderData.profile.website}
                    </p>
                </>
            )}
            {!loaderData.profile && (
                <Form method="POST">
                    <Button type="submit">Add profile</Button>
                </Form>
            )}
            <pre>
                <code>{JSON.stringify(loaderData.profile, null, 4)}</code>
            </pre>
        </div>
    );
}
