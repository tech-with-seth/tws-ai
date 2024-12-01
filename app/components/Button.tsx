import type { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const buttonVariants = cva({
    base: "rounded-xl text-white",
    variants: {
        variant: {
            primary: [
                "bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-600 hover:bg-primary-600",
                "border border-primary-700 dark:border-primary-800",
                "focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800",
            ],
            secondary: [
                "bg-secondary-500 dark:bg-secondary-700 dark:hover:bg-secondary-600 hover:bg-secondary-600",
                "border border-secondary-300 dark:border-secondary-500",
                "focus:ring-4 focus:outline-none focus:ring-secondary-300 dark:focus:ring-secondary-800",
            ],
            icon: [
                "border border-secondary-500 dark:border-secondary-700",
                "focus:ring-4 focus:outline-none focus:ring-secondary-300 dark:focus:ring-secondary-800",
            ],
            ghost: [
                "bg-transparent",
                "hover:bg-zinc-300 dark:hover:bg-zinc-600",
            ],
            outline: [
                "text-primary-700 dark:text-primary-500 dark:hover:text-white",
                "hover:text-white hover:bg-primary-800/20 dark:hover:bg-primary-500/20",
                "border border-primary-700 dark:border-primary-500",
                "focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800",
                "font-medium rounded-xl px-5 py-2.5 text-center",
            ],
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
