import type { VariantProps } from "cva";
import { cx } from "cva.config";
import { PropsWithChildren } from "react";
import { LinkProps, NavLink } from "react-router";
import { buttonVariants } from "./Button";

export interface ButtonNavLinkProps
    extends Omit<LinkProps, "color">,
        VariantProps<typeof buttonVariants> {}

export function ButtonNavLink({
    children,
    color,
    className,
    variant,
    size,
    to,
}: PropsWithChildren<ButtonNavLinkProps>) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cx(
                    "inline-block",
                    buttonVariants({
                        className,
                        color: isActive ? "secondary" : color,
                        size,
                        variant,
                    }),
                )
            }
        >
            {children}
        </NavLink>
    );
}
