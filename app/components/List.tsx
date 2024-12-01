import { cx } from "cva.config";
import { PropsWithChildren, ReactNode } from "react";
import { getUniqueId } from "~/utils/string";

interface ListProps {
    items: ReactNode[];
    className?: string;
    listItemClassName?: string;
}

export function List({ className, listItemClassName, items }: ListProps) {
    return (
        <ul
            className={cx(
                "flex flex-col rounded-xl border border-zinc-300 dark:border-zinc-700",
                className,
            )}
        >
            {items.map((text) => (
                <li
                    className={cx(
                        "border-b border-b-zinc-300 p-4 last-of-type:border-0 dark:border-b-zinc-700",
                        listItemClassName,
                    )}
                    key={getUniqueId("list-item")}
                >
                    {text}
                </li>
            ))}
        </ul>
    );
}
