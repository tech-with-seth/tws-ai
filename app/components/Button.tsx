import type { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const buttonVariants = cva({
    base: "rounded-xl text-white focus:ring-2 focus:outline-none border",
    variants: {
        color: {
            primary: [
                "bg-primary-500 dark:bg-primary-900 dark:hover:bg-primary-600 hover:bg-primary-600",
                "border-primary-700 dark:border-primary-800",
                "focus:ring-primary-300 dark:focus:ring-primary-800",
            ],
            secondary: [
                "bg-secondary-500 dark:bg-secondary-900 dark:hover:bg-secondary-600 hover:bg-secondary-600",
                "border-secondary-700 dark:border-secondary-800",
                "focus:ring-secondary-300 dark:focus:ring-secondary-800",
            ],
            success: [
                "bg-success-500 dark:bg-success-900 dark:hover:bg-success-600 hover:bg-success-600",
                "border-success-700 dark:border-success-800",
                "focus:ring-success-300 dark:focus:ring-success-800",
            ],
            warning: [
                "bg-warning-500 dark:bg-warning-900 dark:hover:bg-warning-600 hover:bg-warning-600",
                "border-warning-700 dark:border-warning-800",
                "focus:ring-warning-300 dark:focus:ring-warning-800",
            ],
            danger: [
                "bg-danger-500 dark:bg-danger-900 dark:hover:bg-danger-600 hover:bg-danger-600",
                "border-danger-700 dark:border-danger-800",
                "focus:ring-danger-300 dark:focus:ring-danger-800",
            ],
        },
        variant: {
            soft: ["border-none"],
            outline: ["bg-transparent dark:bg-transparent"],
        },
        size: {
            sm: "px-2.5 py-1.5 text-sm",
            md: "px-3.5 py-2",
            lg: "px-6 py-3 text-xl",
        },
    },
    defaultVariants: {
        color: "primary",
        size: "md",
    },
    compoundVariants: [
        {
            color: "primary",
            variant: ["soft"],
            className: [
                `bg-primary-300/25 dark:bg-primary-900/25 dark:hover:bg-primary-600/40 hover:bg-primary-600/40`,
                `focus:ring-primary-300 dark:focus:ring-primary-800`,
            ],
        },
        {
            color: "primary",
            variant: ["soft", "outline"],
            className: [
                `text-primary-500 dark:text-primary-500`,
                `hover:bg-primary-300/40 dark:hover:bg-primary-900/40`,
            ],
        },
        {
            color: "secondary",
            variant: ["soft"],
            className: [
                `bg-secondary-300/25 dark:bg-secondary-900/25 dark:hover:bg-secondary-600/40 hover:bg-secondary-600/40`,
                `focus:ring-secondary-300 dark:focus:ring-secondary-800`,
            ],
        },
        {
            color: "secondary",
            variant: ["soft", "outline"],
            className: [
                `text-secondary-500 dark:text-secondary-500`,
                `hover:bg-secondary-300/40 dark:hover:bg-secondary-900/40`,
            ],
        },
        {
            color: "success",
            variant: ["soft"],
            className: [
                `bg-success-300/25 dark:bg-success-900/25 dark:hover:bg-success-600/40 hover:bg-success-600/40`,
                `focus:ring-success-300 dark:focus:ring-success-800`,
            ],
        },
        {
            color: "success",
            variant: ["soft", "outline"],
            className: [
                `text-success-500 dark:text-success-500`,
                `hover:bg-success-300/40 dark:hover:bg-success-900/40`,
            ],
        },
        {
            color: "warning",
            variant: ["soft"],
            className: [
                `bg-warning-300/25 dark:bg-warning-900/25 dark:hover:bg-warning-600/40 hover:bg-warning-600/40`,
                `focus:ring-warning-300 dark:focus:ring-warning-800`,
            ],
        },
        {
            color: "warning",
            variant: ["soft", "outline"],
            className: [
                `text-warning-500 dark:text-warning-500`,
                `hover:bg-warning-300/40 dark:hover:bg-warning-900/40`,
            ],
        },
        {
            color: "danger",
            variant: ["soft"],
            className: [
                `bg-danger-300/25 dark:bg-danger-900/25 dark:hover:bg-danger-600/40 hover:bg-danger-600/40`,
                `focus:ring-danger-300 dark:focus:ring-danger-800`,
            ],
        },
        {
            color: "danger",
            variant: ["soft", "outline"],
            className: [
                `text-danger-500 dark:text-danger-500`,
                `hover:bg-danger-300/40 dark:hover:bg-danger-900/40`,
            ],
        },
    ],
});

export interface ButtonProps
    extends Pick<
            React.ButtonHTMLAttributes<HTMLButtonElement>,
            "className" | "disabled" | "name" | "type" | "value" | "onClick"
        >,
        VariantProps<typeof buttonVariants> {
    iconBefore?: React.ElementType;
    iconAfter?: React.ElementType;
}

export function Button({
    children,
    className,
    color,
    iconBefore: IconBefore,
    iconAfter: IconAfter,
    size,
    variant,
    ...rest
}: PropsWithChildren<ButtonProps>) {
    return (
        <button
            className={cx(
                buttonVariants({
                    className,
                    color,
                    size,
                    variant,
                }),
                (Boolean(IconBefore) || Boolean(IconAfter)) &&
                    children &&
                    "flex items-center gap-1.5",
            )}
            {...rest}
        >
            {IconBefore ? <IconBefore className="h-5 w-5" /> : null}
            {children && <span className="inline-block">{children}</span>}
            {IconAfter ? <IconAfter className="h-5 w-5" /> : null}
        </button>
    );
}
