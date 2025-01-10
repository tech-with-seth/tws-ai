import { cx } from "cva.config";
import { Link, LinkProps } from "react-router";
import { PropsWithChildren } from "react";
import type { VariantProps } from "cva";

import { buttonVariants } from "./Button";

export interface ButtonLinkProps
    extends Pick<LinkProps, "className" | "to">,
        VariantProps<typeof buttonVariants> {
    iconBefore?: JSX.Element;
    iconAfter?: JSX.Element;
}

export function ButtonLink({
    children,
    color,
    className,
    iconBefore: IconBefore,
    iconAfter: IconAfter,
    size,
    to,
    variant,
}: PropsWithChildren<ButtonLinkProps>) {
    return (
        <Link
            className={cx(
                buttonVariants({
                    color,
                    className,
                    variant,
                    size,
                }),
                (Boolean(IconBefore) || Boolean(IconAfter)) &&
                    children &&
                    "flex items-center gap-1.5",
            )}
            to={to}
        >
            {IconBefore ?? null}
            {children && <span className="inline-block">{children}</span>}
            {IconAfter ?? null}
        </Link>
    );
}
