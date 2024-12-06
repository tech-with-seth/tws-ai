import invariant from "tiny-invariant";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { createUserSession, getUser } from "~/utils/auth.server";
import {
    data,
    Form,
    Link,
    redirect,
    useActionData,
    useSearchParams,
} from "react-router";
import { Paths } from "~/utils/paths";
import { Route } from "../+types/login";
import { safeRedirect } from "~/utils/routing";
import { TextFormField } from "~/components/form/TextFormField";
import { verifyLogin } from "~/models/user.server";
import { HorizontalRule } from "~/components/HorizontalRule";

export async function loader({ request }: Route.LoaderArgs) {
    return (await getUser(request)) ? redirect(Paths.DASHBOARD) : null;
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const redirectTo = safeRedirect(
        String(formData.get("redirectTo")),
        Paths.DASHBOARD,
    );

    const errors: Record<string, string> = {};

    // TODO: Update validation
    if (!email.includes("@")) {
        errors.email = "Invalid email address";
    }

    if (password.length < 12) {
        errors.password = "Password should be at least 12 characters";
    }

    if (Object.keys(errors).length > 0) {
        return data({ errors }, { status: 400 });
    }

    const user = await verifyLogin(email, password);
    invariant(user, "User not found");

    return await createUserSession(user.id, redirectTo);
}

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const data = useActionData();
    const redirectTo = searchParams.get("redirectTo") || Paths.DASHBOARD;

    return (
        <>
            <h1 className="mb-4 text-6xl font-bold">Login</h1>
            <Card>
                <Form method="POST" className="flex flex-col gap-4">
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <TextFormField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        errorText={data?.errors?.email}
                    />
                    <TextFormField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        errorText={data?.errors?.password}
                    />
                    <Button
                        type="submit"
                        disabled={false}
                        className="self-start"
                    >
                        Login
                    </Button>
                </Form>
                <HorizontalRule />
                Don't have an account?{" "}
                <Link to={Paths.JOIN} className="text-primary-500">
                    Join here
                </Link>
            </Card>
        </>
    );
}
