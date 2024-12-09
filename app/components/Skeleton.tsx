import { HTMLAttributes } from "react";
import { VariantProps } from "cva";
import { cva, cx } from "cva.config";

export const skeletonVariants = cva({
    base: "rounded-xl bg-zinc-500 animate-pulse",
    variants: {
        variant: {
            text: "min-h-8 min-w-[300px]",
            block: "min-h-12 min-w-[300px]",
            square: "min-h-24 min-w-24",
        },
    },
});

interface SkeletonProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant }: SkeletonProps) {
    return (
        <div className={cx(skeletonVariants({ className, variant }))}> </div>
    );
}
