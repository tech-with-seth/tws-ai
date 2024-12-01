export enum Paths {
    BASE = "/",
    API = "/api",
    DASHBOARD = "/dashboard",
    JOIN = "/join",
    LOGIN = "/login",
    LOGOUT = "/logout",
    // ASSISTANT ==========
    ASSISTANTS = "assistants",
    CREATE_ASSISTANT = "create-assistant",
    API_ASSISTANTS = "/api/assistants",
    ASSISTANT_DETAILS = "/assistant-details",
    // THREAD ==========
    THREADS = "threads",
    CREATE_THREAD = "create-thread",
    API_THREADS = "/api/threads",
    // STREAM ==========
    STREAM = "/stream",
    // FILE ==========
    FILES = "files",
    CREATE_FILE = "create-file",
    API_FILES = "/api/files",
}

// ASSISTANTS ==========
export function getAssistantPath(assistantId: string) {
    return `${Paths.ASSISTANTS}/${assistantId}`;
}

export function getAssistantFilesPath(assistantId: string) {
    return `${Paths.API}${Paths.ASSISTANTS}/${assistantId}${Paths.FILES}`;
}

export function getAssistantAPIPath(assistantId: string) {
    return `${Paths.API}${Paths.ASSISTANTS}/${assistantId}`;
}

// AUTH ==========
export function getLoginPath(searchParams: string) {
    return `${Paths.LOGIN}?${searchParams}`;
}

// CHAT ==========
export function getChatPath(assistantId: string, threadId: string) {
    return `${Paths.DASHBOARD}/${assistantId}/${threadId}`;
}

export function getThreadStream(assistantId: string, threadId: string) {
    return `${Paths.API}/stream/${assistantId}/${threadId}`;
}

// FILES ==========
export function getFilePath(fileId: string) {
    return `${Paths.FILES}/${fileId}`;
}

export function getFileCreatePath(assistantId: string) {
    return `${Paths.DASHBOARD}/${assistantId}/files/create`;
}

// THREADS ==========
export function deleteThreadPath(threadId: string) {
    return `${Paths.API}${Paths.THREADS}/${threadId}`;
}
