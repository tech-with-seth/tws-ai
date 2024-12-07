import { cva, cx } from "cva.config";

export interface TextFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

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
    type,
    ...rest
}: TextFieldProps) {
    return (
        <input
            className={cx(textFieldVariants({ className }))}
            type={type}
            {...rest}
        />
    );
}
