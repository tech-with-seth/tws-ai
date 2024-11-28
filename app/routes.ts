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
            route(Paths.ASSISTANT_CREATE, "routes/create-assistant.tsx"),
        ]),
    ]),
    ...prefix(Paths.API, [route(Paths.ASSISTANTS, "routes/api/assistants.ts")]),
] satisfies RouteConfig;
