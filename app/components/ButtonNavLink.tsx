import type { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";
import { LinkProps, NavLink } from "react-router";

export const buttonNavLinkVariants = cva({
    base: [
        "rounded-xl text-white",
        "bg-zinc-500 dark:bg-zinc-900 dark:hover:bg-zinc-600 hover:bg-zinc-600",
        "border-zinc-700 dark:border-zinc-800",
        "focus:ring-zinc-300 dark:focus:ring-zinc-800",
        "px-3.5 py-2",
    ],
    variants: {
        active: {
            true: [
                "bg-primary-500 dark:bg-primary-900 dark:hover:bg-primary-600 hover:bg-primary-600",
                "border-primary-700 dark:border-primary-800",
                "focus:ring-primary-300 dark:focus:ring-primary-800",
            ],
        },
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-3.5 py-2",
            lg: "px-6 py-3 text-xl",
        },
    },
});

export interface ButtonNavLinkProps
    extends LinkProps,
        VariantProps<typeof buttonNavLinkVariants> {
    iconBefore?: JSX.Element;
    iconAfter?: JSX.Element;
}

export function ButtonNavLink({
    children,
    className,
    iconBefore,
    iconAfter,
    size,
    to,
}: PropsWithChildren<ButtonNavLinkProps>) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cx(
                    "inline-flex items-center gap-2",
                    buttonNavLinkVariants({
                        active: isActive,
                        className,
                        size,
                    }),
                )
            }
        >
            {iconBefore}
            {children}
            {iconAfter}
        </NavLink>
    );
}
