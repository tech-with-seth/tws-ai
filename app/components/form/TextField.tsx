import React, { forwardRef } from "react";
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

function _TextField(props: TextFieldProps, ref: React.Ref<HTMLInputElement>) {
    const { className, type, ...rest } = props;

    return (
        <input
            className={cx(textFieldVariants({ className }))}
            ref={ref}
            type={type}
            {...rest}
        />
    );
}

// I hate this syntax...fix later...
export const TextField = forwardRef(_TextField);
