import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/utils/validations';

import { Button } from '~/components/Button';
import Card from '~/components/Card';
import TextFormField from '~/components/TextFormField';
import { Form, redirect, useActionData, useSearchParams } from 'react-router';
import { Paths } from '~/utils/paths';
import { createUserSession, getUser } from '~/utils/auth.server';
import { verifyLogin } from '~/models/user.server';
import { safeRedirect } from '~/utils/routing';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { Route } from './+types/login';

export async function loader({ request }: Route.LoaderArgs) {
    return (await getUser(request)) ? redirect(Paths.DASHBOARD) : null;
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: loginSchema });
    const redirectTo = safeRedirect(
        formData.get('redirectTo'),
        Paths.DASHBOARD
    );

    const user = await verifyLogin(
        String(formData.get('email')),
        String(formData.get('password'))
    );

    if (submission.status !== 'success' || !user) {
        return submission.reply({
            formErrors: ['Incorrect username or password']
        });
    }

    return await createUserSession(user.id, redirectTo);
}

export default function LoginRoute() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || Paths.DASHBOARD;

    const lastResult = useActionData<typeof action>();

    const [form, fields] = useForm({
        id: 'loginForm',
        constraint: getZodConstraint(loginSchema),
        // @ts-ignore
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: loginSchema });
        }
    });

    return (
        <div className="grid lg:grid-cols-12 h-full">
            <div className="self-center col-start-5 col-span-4">
                <h1 className="text-6xl font-bold mb-4">Login</h1>
                <Card>
                    <Form className="space-y-4" {...getFormProps(form)}>
                        <input
                            type="hidden"
                            name="redirectTo"
                            value={redirectTo}
                        />
                        <TextFormField
                            {...getInputProps(fields.email, {
                                name: 'email',
                                type: 'email'
                            })}
                            id="email"
                            label="Email"
                            errorText={fields.email.errors}
                        />
                        <TextFormField
                            {...getInputProps(fields.password, {
                                name: 'password',
                                type: 'password'
                            })}
                            id="password"
                            label="Password"
                            errorText={fields.password.errors}
                        />
                        <Button type="submit">Login</Button>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
