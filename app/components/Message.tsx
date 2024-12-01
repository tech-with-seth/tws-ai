import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";
import { Card } from "./Card";
import { BotIcon, CircleUserIcon, PersonStanding } from "lucide-react";

export const messageVariants = cva({
    base: "text-white",
    variants: {
        role: {
            user: "bg-primary-400 dark:bg-primary-800",
            assistant: "bg-gray-400 dark:bg-gray-800",
            system: "bg-primary-500 dark:bg-primary-500 text-left",
            data: "bg-primary-500 dark:bg-primary-500 text-left",
        },
    },
    defaultVariants: {},
});

interface MessageProps extends VariantProps<typeof messageVariants> {}

export function Message({ children, role }: PropsWithChildren<MessageProps>) {
    const isUser = role === "user";
    const isAssistant = role === "assistant";

    return (
        <div
            className={cx(
                "flex items-start gap-2",
                isUser && "self-end text-right",
                isAssistant && "self-start text-left",
            )}
        >
            {isAssistant && (
                <Card className="p-2" border={false}>
                    <BotIcon className="h-6 w-6" />
                </Card>
            )}
            <Card
                className={cx("flex gap-2", messageVariants({ role }))}
                border={false}
            >
                {children}
            </Card>
            {isUser && (
                <Card className="p-2" border={false}>
                    <CircleUserIcon className="h-6 w-6" />
                </Card>
            )}
        </div>
    );
}
