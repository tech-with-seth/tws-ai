import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const bannerVariants = cva({
    base: "p-4 border rounded-xl",
    variants: {
        variant: {
            primary:
                "border-primary-500 dark:border-primary-500 dark:bg-primary-900",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
    compoundVariants: [],
});

interface BannerProps extends VariantProps<typeof bannerVariants> {}

export function Banner({ children, variant }: PropsWithChildren<BannerProps>) {
    return <div className={cx(bannerVariants({ variant }))}>{children}</div>;
}
