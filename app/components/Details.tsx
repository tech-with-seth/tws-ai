import { cx } from "cva.config";
import { PropsWithChildren } from "react";

interface DetailsProps {
    text: string;
    className?: string;
}

export function Details({
    children,
    className,
    text,
}: PropsWithChildren<DetailsProps>) {
    return (
        <details
            className={cx(
                "rounded-xl border border-zinc-300 dark:border-zinc-700",
                className,
            )}
        >
            <summary className="cursor-pointer p-4">{text}</summary>
            <div className="p-4">{children}</div>
        </details>
    );
}
