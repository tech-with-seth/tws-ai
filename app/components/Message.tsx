import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";
import { Card } from "./Card";
import { BotIcon, CircleUserIcon } from "lucide-react";

export const messageVariants = cva({
    base: "text-white",
    variants: {
        role: {
            user: "bg-primary-400 dark:bg-primary-800",
            assistant: "bg-secondary-400 dark:bg-secondary-800",
            system: "bg-secondary-500 dark:bg-secondary-500 text-left",
            data: "bg-secondary-500 dark:bg-secondary-500 text-left",
        },
    },
});

interface MessageProps extends VariantProps<typeof messageVariants> {}

export function Message({ children, role }: PropsWithChildren<MessageProps>) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";
    const containerClassName = cx(
        "prose flex items-start gap-2 prose-p:my-0 md:max-w-[90%] prose-strong:dark:text-primary-200",
        isUser && "self-end text-right",
        isAssistant && "self-start text-left",
    );

    return (
        <div className={containerClassName}>
            {isAssistant && (
                <Card border={false}>
                    <BotIcon className="h-6 w-6 text-white" />
                </Card>
            )}
            <Card className={cx(messageVariants({ role }))} border={false}>
                {children}
            </Card>
            {isUser && (
                <Card border={false}>
                    <CircleUserIcon className="h-6 w-6 text-white" />
                </Card>
            )}
        </div>
    );
}
