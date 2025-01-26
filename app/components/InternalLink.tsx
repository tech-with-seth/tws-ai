import { PropsWithChildren } from "react";
import { NavLink } from "react-router";
import { VariantProps } from "cva";

import { cva, cx } from "cva.config";

export const internalLinkVariants = cva({
    base: "hover:underline block px-4 py-2 rounded-xl",
    variants: {
        variant: {
            primary: "",
            secondary: "",
        },
        isActive: {
            true: "font-bold bg-primary-100 dark:bg-primary-900",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
    compoundVariants: [
        {
            isActive: true,
            variant: ["primary", "secondary"],
            className: "text-white",
        },
    ],
});

export interface InternalLinkProps
    extends VariantProps<typeof internalLinkVariants> {
    to: string;
    end?: boolean;
}

export function InternalLink({
    children,
    end,
    variant,
    to,
}: PropsWithChildren<InternalLinkProps>) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cx(internalLinkVariants({ isActive, variant }))
            }
            end={end}
        >
            {children}
        </NavLink>
    );
}
