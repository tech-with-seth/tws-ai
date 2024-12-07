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
    },
});

export interface ButtonNavLinkProps
    extends LinkProps,
        VariantProps<typeof buttonNavLinkVariants> {}

export function ButtonNavLink({
    children,
    className,
    to,
}: PropsWithChildren<ButtonNavLinkProps>) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cx(
                    "inline-block",
                    buttonNavLinkVariants({
                        className,
                        active: isActive,
                    }),
                )
            }
        >
            {children}
        </NavLink>
    );
}
