import { defineConfig, Studio } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemaTypes";

const config = defineConfig({
    apiVersion: "2024-01-01",
    projectId: "goagq6ib",
    dataset: "production",
    CorsOrigin: "http://localhost:5173",
    schema: {
        types: schemaTypes,
    },
    plugins: [structureTool(), visionTool()],
    basePath: "/admin/studio",
});

export default function StudioRoute() {
    return <Studio config={config} />;
}
