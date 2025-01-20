import invariant from "tiny-invariant";

import { createProfileForUser, getProfileById } from "~/models/profile.server";
import { Route } from "../profile/+types/index";
import { getUserId } from "~/utils/auth.server";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Form } from "react-router";
import { Button } from "~/components/Button";

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    invariant(userId, "User ID not found");

    return {
        profile: await getProfileById(userId),
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
            {loaderData && loaderData.profile && (
                <h1>{loaderData.profile.firstName}</h1>
            )}
            <Form method="POST">
                <Button type="submit">Add profile</Button>
            </Form>
        </div>
    );
}
