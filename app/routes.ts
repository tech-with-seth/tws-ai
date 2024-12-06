import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from "@react-router/dev/routes";
import { Paths } from "./utils/paths";

export default [
    layout("./routes/public/site.tsx", [
        index("routes/public/home.tsx"),
        layout("./routes/auth/turnstile.tsx", [
            route(Paths.LOGIN, "routes/auth/login.tsx"),
            route(Paths.JOIN, "routes/auth/join.tsx"),
        ]),
        route(Paths.LOGOUT, "routes/auth/logout.tsx"),
    ]),
    layout("./routes/protected/restricted.tsx", [
        route(Paths.DASHBOARD, "routes/protected/dashboard.tsx", [
            route(
                Paths.CREATE_ASSISTANT,
                "routes/assistants/create-assistant.tsx",
            ),
            route(Paths.CREATE_THREAD, "routes/threads/create-thread.tsx"),
            route(":assistantId/:threadId", "routes/threads/chat.tsx"),
            route(
                `:assistantId/${Paths.CREATE_FILE}`,
                "routes/files/create-file.tsx",
            ),
        ]),
        route(`/:assistantId`, "routes/assistants/assistant-details.tsx"),
        ...prefix("admin", [route("labs", "routes/admin/labs.tsx")]),
    ]),
    ...prefix(Paths.API, [
        route(Paths.ASSISTANTS, "routes/api/assistants.ts"),
        route(Paths.FILES, "routes/api/files.ts"),
        route(Paths.THREADS, "routes/api/threads.ts"),
        route(`${Paths.THREADS}/:threadId`, "routes/api/thread.ts"),
        route(`${Paths.STREAM}/:assistantId/:threadId`, "routes/api/stream.ts"),
    ]),
] satisfies RouteConfig;
