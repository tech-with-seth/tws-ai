import { ai } from '~/open-ai';

export function createRun(threadId: string, assistant_id: string) {
    return ai.beta.threads.runs.create(threadId, {
        assistant_id
    });
}

export function getRuns(threadId: string) {
    return ai.beta.threads.runs.list(threadId);
}

export function getRun(threadId: string, runId: string) {
    return ai.beta.threads.runs.retrieve(threadId, runId);
}

export function updateRun(threadId: string, runId: string, metadata: unknown) {
    return ai.beta.threads.runs.update(threadId, runId, {
        metadata
    });
}

export function cancelRun(threadId: string, runId: string) {
    return ai.beta.threads.runs.cancel(threadId, runId);
}
