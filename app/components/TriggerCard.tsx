import { PropsWithChildren } from "react";
import { Card } from "./Card";
import { useRealtimeRun, useTaskTrigger } from "@trigger.dev/react-hooks";
import { Button } from "./Button";
import { Details } from "./Details";
import { LoaderPinwheelIcon } from "lucide-react";

interface TriggerCardProps {
    cta: string;
    taskId: string;
}

const RunContainer = ({ runId }: { runId: string }) => {
    const { run } = useRealtimeRun(runId);

    return (
        <>
            <pre>
                <code>{JSON.stringify(run?.output, null, 4)}</code>
            </pre>
            <Details text="Full results">
                {JSON.stringify(run, null, 4)}
            </Details>
        </>
    );
};

export function TriggerCard({
    cta,
    taskId,
}: PropsWithChildren<TriggerCardProps>) {
    const {
        submit,
        handle,
        error,
        isLoading: isTriggerLoading,
    } = useTaskTrigger(taskId);

    return (
        <Card>
            <div>
                {isTriggerLoading && (
                    <LoaderPinwheelIcon className="my-4 animate-spin" />
                )}
            </div>
            {/* <div>{JSON.stringify({ handle, isTriggerLoading, error })}</div> */}
            <Button
                onClick={() => {
                    submit({}, {});
                }}
            >
                {cta}
            </Button>
            {handle && handle.id && <RunContainer runId={handle.id} />}
        </Card>
    );
}
