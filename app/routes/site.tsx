import { Outlet } from 'react-router';

export default function Site() {
    return (
        <main className="h-full bg-[url('https://images.unsplash.com/photo-1631376178637-392efc9e356b?q=80&w=3473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover">
            <div className="relative z-10 h-full">
                <Outlet />
            </div>
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-zinc-900/95 z-0"></div>
        </main>
    );
}
