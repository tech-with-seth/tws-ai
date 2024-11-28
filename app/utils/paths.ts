export enum Paths {
    API = "/api",
    ASSISTANTS = "/assistants",
    API_ASSISTANTS = "/api/assistants",
    BASE = "/",
    DASHBOARD = "/dashboard",
    FILES = "/files",
    JOIN = "/join",
    LOGIN = "/login",
    LOGOUT = "/logout",
    THREADS = "/threads",
    THREAD_CREATE = "/dashboard/create-thread",
    ASSISTANT_CREATE = "/dashboard/create-assistant",
}

// AUTH ==========
export function getLoginPath(searchParams: string) {
    return `${Paths.LOGIN}?${searchParams}`;
}
