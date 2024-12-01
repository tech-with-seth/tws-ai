import type { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const buttonVariants = cva({
    base: "rounded-xl text-white",
    variants: {
        variant: {
            primary:
                "border border-primary-700 dark:border-primary-300 bg-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 hover:bg-primary-600",
            secondary: "bg-secondary-500 hover:bg-secondary-600",
            icon: "rounded-xl border border-zinc-300 dark:border-zinc-600",
            ghost: "bg-transparent",
            outline:
                "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800",
        },
        size: {
            sm: "px-2.5 py-1.5 text-sm",
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
