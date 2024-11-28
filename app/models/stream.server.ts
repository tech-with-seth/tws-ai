import { ai } from "~/open-ai";
import { getEnvVariable } from "~/utils/string";

export function getStream(threadId: string) {
    return ai.beta.threads.runs.stream(
        threadId,
        {
            assistant_id: getEnvVariable("OPENAI_ASSISTANT_ID"),
        },
        {
            stream: true,
        },
    );
}
