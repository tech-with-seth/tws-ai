import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: "goagq6ib",
    dataset: "production",
});
