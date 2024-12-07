import { SendHorizonalIcon } from "lucide-react";
import { useFetcher } from "react-router";

import { Banner } from "~/components/Banner";
import { Button } from "~/components/Button";
import { TextField } from "~/components/form/TextField";

export default function NewThreadRoute() {
    const newThreadFetcher = useFetcher();

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                    <Banner>Chats will show here...</Banner>
                </div>
                <div className="border-t border-t-zinc-300 p-4 dark:border-t-zinc-600">
                    <newThreadFetcher.Form
                        className="flex gap-2"
                        method="POST"
                        action="/api/threads"
                    >
                        <TextField
                            autoComplete="off"
                            className="flex-1"
                            name="prompt"
                            placeholder="Type a prompt..."
                        />
                        <Button
                            className="flex gap-2"
                            iconAfter={<SendHorizonalIcon />}
                            name="intent"
                            value="newThread"
                        >
                            Send
                        </Button>
                    </newThreadFetcher.Form>
                </div>
            </div>
        </>
    );
}
