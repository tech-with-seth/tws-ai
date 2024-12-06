import type { VariantProps } from "cva";
import { cx } from "cva.config";
import { PropsWithChildren } from "react";
import { Link, LinkProps } from "react-router";
import { buttonVariants } from "./Button";

export interface ButtonLinkProps
    extends Pick<LinkProps, "className" | "to">,
        VariantProps<typeof buttonVariants> {}

export function ButtonLink({
    children,
    className,
    variant,
    size,
    to,
}: PropsWithChildren<ButtonLinkProps>) {
    return (
        <Link
            to={to}
            className={cx(
                "inline-block",
                buttonVariants({
                    className,
                    variant,
                    size,
                }),
            )}
        >
            {children}
        </Link>
    );
}
