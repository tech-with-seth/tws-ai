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
    layout("./routes/auth/restricted.tsx", [
        layout("./routes/app.tsx", [
            route(Paths.DASHBOARD, "routes/dashboard/index.tsx", [
                layout("./routes/dashboard/drawer.tsx", [
                    route(
                        Paths.CREATE_THREAD,
                        "routes/dashboard/create-thread.tsx",
                    ),
                    route(
                        ":assistantId/:threadId",
                        "routes/dashboard/chat.tsx",
                    ),
                    route(
                        `:assistantId/${Paths.CREATE_FILE}`,
                        "routes/dashboard/create-file.tsx",
                    ),
                ]),
            ]),
            layout("routes/assistants/layout.tsx", [
                route(Paths.ASSISTANTS, "routes/assistants/index.tsx"),
                route(
                    `${Paths.ASSISTANTS}/${Paths.CREATE_ASSISTANT}`,
                    "routes/assistants/create.tsx",
                ),
            ]),
            layout("routes/agents/layout.tsx", [
                route(Paths.AGENTS, "routes/agents/index.tsx"),
                route(
                    `${Paths.AGENTS}/${Paths.CREATE_AGENT}`,
                    "routes/agents/create.tsx",
                ),
            ]),
            route(Paths.PROFILE, "routes/profile/index.tsx"),
            route(`:assistantId`, "routes/assistants/assistant-details.tsx"),
        ]),
        layout("./routes/admin.tsx", [
            route(`labs`, "routes/labs.tsx"),
            route(`studio/*`, "routes/studio/index.tsx"),
            route(`ui`, "routes/ui.tsx"),
        ]),
    ]),
    ...prefix(Paths.API, [
        route(Paths.ASSISTANTS, "routes/api/assistants.ts"),
        route(Paths.FILES, "routes/api/files.ts"),
        route(Paths.THREADS, "routes/api/threads.ts"),
        route(`${Paths.THREADS}/:threadId`, "routes/api/thread.ts"),
        route(`${Paths.STREAM}/:assistantId/:threadId`, "routes/api/stream.ts"),
    ]),
] satisfies RouteConfig;
