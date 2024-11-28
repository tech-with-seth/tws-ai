import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const bannerVariants = cva({
    base: "p-4 border rounded-xl",
    variants: {
        variant: {
            primary:
                "border-primary-500 dark:border-primary-500 dark:bg-primary-900",
            warning:
                "bg-secondary-300/50 border-secondary-500/20 dark:border-secondary-500 dark:bg-secondary-900/20",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
    compoundVariants: [],
});

interface BannerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof bannerVariants> {}

export function Banner({
    children,
    className,
    variant,
}: PropsWithChildren<BannerProps>) {
    return (
        <div className={cx(bannerVariants({ variant }), className)}>
            {children}
        </div>
    );
}
