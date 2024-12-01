import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from "@react-router/dev/routes";
import { Paths } from "./utils/paths";

export default [
    layout("./routes/site.tsx", [
        index("routes/home.tsx"),
        route(Paths.LOGIN, "routes/login.tsx"),
        route(Paths.JOIN, "routes/join.tsx"),
    ]),
    layout("./routes/restricted.tsx", [
        route(Paths.DASHBOARD, "routes/dashboard.tsx", [
            route(Paths.CREATE_ASSISTANT, "routes/create-assistant.tsx"),
            route(Paths.CREATE_THREAD, "routes/create-thread.tsx"),
            route(":assistantId/:threadId", "routes/chat.tsx"),
            route(
                `:assistantId/${Paths.CREATE_FILE}`,
                "routes/create-file.tsx",
            ),
        ]),
    ]),
    ...prefix(Paths.API, [
        route(Paths.ASSISTANTS, "routes/api/assistants.ts"),
        route(Paths.FILES, "routes/api/files.ts"),
        route(Paths.THREADS, "routes/api/threads.ts"),
        route(`${Paths.STREAM}/:assistantId/:threadId`, "routes/api/stream.ts"),
    ]),
] satisfies RouteConfig;
