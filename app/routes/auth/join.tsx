import {
    data,
    Form,
    Link,
    redirect,
    useActionData,
    useSearchParams,
} from "react-router";

import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { createUser } from "~/models/user.server";
import { Paths } from "~/utils/paths";
import { safeRedirect } from "~/utils/routing";
import { TextFormField } from "~/components/form/TextFormField";
import { HorizontalRule } from "~/components/HorizontalRule";
import { Route } from "./+types/join";
import { Heading } from "~/components/Heading";

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

    const user = await createUser({
        email,
        firstName: "Jim",
        lastName: "Carrey",
        password,
    });

    if (user) {
        return redirect(redirectTo);
    }

    return redirect(Paths.LOGIN);
}

export default function JoinRoute() {
    const [searchParams] = useSearchParams();
    const data = useActionData();
    const redirectTo = searchParams.get("redirectTo") || Paths.DASHBOARD;

    return (
        <>
            <Heading as="h1" className="mb-4 text-6xl font-bold">
                Join
            </Heading>
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
                        Sign up
                    </Button>
                </Form>
                <HorizontalRule />
                Already have an account?{" "}
                <Link to={Paths.LOGIN} className="text-primary-500">
                    Login here
                </Link>
            </Card>
        </>
    );
}
