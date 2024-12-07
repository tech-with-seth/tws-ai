import { cva, cx } from "cva.config";

export interface TextareaFieldProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const textFieldVariants = cva({
    base: "p-2 border border-zinc-400 dark:border-zinc-600 rounded-xl",
    variants: {
        hasError: {
            true: "border-red-500 dark:border-red-600",
        },
    },
});

export default function TextField({
    className,
    rows = 10,
    ...rest
}: TextareaFieldProps) {
    return (
        <textarea
            className={cx(textFieldVariants({ className }))}
            rows={rows}
            {...rest}
        />
    );
}
