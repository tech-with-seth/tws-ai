export enum Paths {
    API = '/api',
    API_ASSISTANTS = '/api/assistants',
    API_FILES = '/api/files',
    API_THEME = '/api/theme',
    API_THREADS = '/api/threads',
    API_TRIGGER = '/api/trigger',
    ASSISTANTS = '/assistants',
    BASE = '/',
    DASHBOARD = '/dashboard',
    FILES = '/files',
    JOIN = '/join',
    LOGIN = '/login',
    LOGOUT = '/logout',
    THREADS = '/threads',
    THREAD_CREATE = '/dashboard/threads/create',
    ASSISTANT_CREATE = '/dashboard/assistants/create'
}

// AUTH ==========
export function getLoginPath(searchParams: string) {
    return `${Paths.LOGIN}?${searchParams}`;
}
