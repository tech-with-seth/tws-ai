import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const bannerVariants = cva({
    base: "flex items-center gap-4 p-4 border rounded-xl",
    variants: {
        variant: {
            default:
                "bg-zinc-300 border-zinc-500 dark:bg-zinc-800 dark:border-zinc-600",
            primary:
                "border-primary-500 dark:border-primary-500 dark:bg-primary-900",
            warning:
                "bg-secondary-300/50 border-secondary-500/20 dark:border-secondary-500 dark:bg-secondary-900/20",
        },
    },
    defaultVariants: {
        variant: "default",
    },
    compoundVariants: [],
});

interface BannerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof bannerVariants> {
    icon?: React.ReactNode;
}

export function Banner({
    children,
    className,
    icon,
    variant,
}: PropsWithChildren<BannerProps>) {
    return (
        <div className={cx(bannerVariants({ className, variant }))}>
            {icon && <div>{icon}</div>}
            <div>{children}</div>
        </div>
    );
}
