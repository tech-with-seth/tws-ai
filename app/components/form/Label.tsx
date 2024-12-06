import { cx } from "cva";
import { PropsWithChildren } from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({
    children,
    className,
    id,
}: PropsWithChildren<LabelProps>) {
    return (
        <label
            htmlFor={id}
            className={cx(`inline-block text-lg font-bold`, className)}
        >
            {children}
        </label>
    );
}
