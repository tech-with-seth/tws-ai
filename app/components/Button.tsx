import type { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const buttonVariants = cva({
    base: "rounded-xl text-white",
    variants: {
        variant: {
            primary: "bg-primary-500 hover:bg-primary-600",
            secondary: "bg-gray-500 hover:bg-gray-600",
            icon: "rounded-xl border border-zinc-300 dark:border-zinc-800",
            ghost: "bg-transparent",
            outline:
                "border border-primary-500 text-primary-500 bg-transparent dark:hover:bg-zinc-800/50",
        },
        size: {
            md: "px-3.5 py-2",
            lg: "px-6 py-3 text-xl",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
    compoundVariants: [
        {
            variant: "icon",
            size: "md",
            className: "p-2",
        },
        {
            variant: "icon",
            size: "lg",
            className: "p-3",
        },
    ],
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    className?: string;
}

export function Button({
    children,
    className,
    variant,
    size,
    ...rest
}: PropsWithChildren<ButtonProps>) {
    return (
        <button
            className={cx(
                buttonVariants({
                    variant,
                    size,
                }),
                className,
            )}
            {...rest}
        >
            {children}
        </button>
    );
}
