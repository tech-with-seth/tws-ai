import Card from '~/components/Card';

export default function LoginRoute() {
    return (
        <div className="grid lg:grid-cols-12 h-full">
            <div className="self-center col-start-5 col-span-4">
                <h1 className="text-6xl font-bold mb-4">Login</h1>
                <Card>
                    <form>
                        <div className="mb-4">
                            <label>Email</label>
                            <input type="email" />
                        </div>
                        <div className="mb-4">
                            <label>Password</label>
                            <input type="password" />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
