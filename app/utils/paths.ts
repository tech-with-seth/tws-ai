export enum Paths {
    ADMIN = "admin",
    AGENTS = "agents",
    ANALYTICS = "analytics",
    API = "api",
    ASSISTANT_DETAILS = "assistant-details",
    ASSISTANTS = "assistants",
    BASE = "/",
    CREATE_AGENT = "create",
    CREATE_ASSISTANT = "create",
    CREATE_FILE = "create-file",
    CREATE_THREAD = "create-thread",
    DASHBOARD = "dashboard",
    DATA_MANAGER = "data-manager",
    FILES = "files",
    JOIN = "join",
    LABS = "labs",
    LOGIN = "login",
    LOGOUT = "logout",
    MESSAGES = "messages",
    PROFILE = "profile",
    STREAM = "stream",
    STUDIO = "studio/*", // SPECIAL, DO NOT REMOVE
    THREADS = "threads",
    UI = "ui",
}

// ASSISTANTS ==========
export function getAssistantPath(assistantId: string) {
    return `${Paths.BASE}${Paths.ASSISTANTS}/${assistantId}`;
}

export function getAssistantFilesPath(assistantId: string) {
    return `${Paths.BASE}${Paths.API}/${Paths.ASSISTANTS}/${assistantId}${Paths.FILES}`;
}

export function getAssistantsApiPath() {
    return `${Paths.BASE}${Paths.API}/${Paths.ASSISTANTS}`;
}

// AUTH ==========
export function getLoginPath(searchParams: string) {
    return `${Paths.BASE}${Paths.LOGIN}?${searchParams}`;
}

// CHAT ==========
export function getChatPath(assistantId: string, threadId: string) {
    return `${Paths.BASE}${Paths.DASHBOARD}/${assistantId}/${threadId}`;
}

export function getThreadStream(assistantId: string, threadId: string) {
    return `${Paths.BASE}${Paths.API}/${Paths.STREAM}/${assistantId}/${threadId}`;
}

// FILES ==========
export function getFilePath(fileId: string) {
    return `${Paths.BASE}${Paths.FILES}/${fileId}`;
}

export function getFileCreatePath(assistantId: string) {
    return `${Paths.BASE}${Paths.DASHBOARD}/${assistantId}/files/create`;
}

// MESSAGES ==========

export function getMessagesApiPath() {
    return `${Paths.BASE}${Paths.API}/${Paths.MESSAGES}`;
}

// THREADS ==========
export function getThreadsApiPath() {
    return `${Paths.BASE}${Paths.API}/${Paths.THREADS}`;
}

export function deleteThreadPath(threadId: string) {
    return `${Paths.BASE}${Paths.API}/${Paths.THREADS}/${threadId}`;
}
