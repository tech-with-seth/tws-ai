import { ReactNode } from "react";
import { VariantProps } from "cva";

import { cva, cx } from "cva.config";

export const headingVariants = cva({
    base: "text-zinc-800 dark:text-white font-bold",
    variants: {
        as: {
            h1: "text-5xl",
            h2: "text-4xl",
            h3: "text-3xl",
            h4: "text-2xl",
            h5: "text-xl",
            h6: "text-lg",
        },
    },
    defaultVariants: {
        as: "h2",
    },
});

export interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headingVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: ReactNode;
}

export function Heading({ as, children, className }: HeadingProps) {
    const Component = as || "h2";

    return (
        <Component className={cx(headingVariants({ as, className }))}>
            {children}
        </Component>
    );
}
