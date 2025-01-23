import { PropsWithChildren } from "react";
import { NavLink } from "react-router";
import { VariantProps } from "cva";

import { cva, cx } from "cva.config";

export const internalLinkVariants = cva({
    base: "hover:underline",
    variants: {
        variant: {
            primary:
                "text-primary-400 hover:text-primary-300 dark:text-primary-500 dark:hover:text-primary-400",
            secondary:
                "text-secondary-400 hover:text-secondary-300 dark:text-secondary-500 dark:hover:text-secondary-400",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
    compoundVariants: [],
});

export interface InternalLinkProps
    extends VariantProps<typeof internalLinkVariants> {
    to: string;
}

export function InternalLink({
    children,
    variant,
    to,
}: PropsWithChildren<InternalLinkProps>) {
    return (
        <NavLink to={to} className={cx(internalLinkVariants({ variant }))}>
            {children}
        </NavLink>
    );
}
