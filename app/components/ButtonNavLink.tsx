import type { VariantProps } from "cva";
import { cx } from "cva.config";
import { PropsWithChildren } from "react";
import { LinkProps, NavLink } from "react-router";
import { buttonVariants } from "./Button";

export interface ButtonNavLinkProps
    extends LinkProps,
        VariantProps<typeof buttonVariants> {}

export function ButtonNavLink({
    children,
    className,
    variant,
    size,
    to,
}: PropsWithChildren<ButtonNavLinkProps>) {
    return (
        <NavLink
            to={to}
            className={cx(
                "inline-block",
                buttonVariants({
                    variant,
                    size,
                }),
                className,
            )}
        >
            {children}
        </NavLink>
    );
}
