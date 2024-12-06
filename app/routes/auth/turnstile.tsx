import { Outlet } from "react-router";

export default function Turnstile() {
    return (
        <div className="grid h-full sm:grid-cols-12">
            <div className="self-center px-4 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-5">
                <Outlet />
            </div>
        </div>
    );
}
