import { VariantProps } from "cva";
import { cva, cx } from "cva.config";

export const hrVariants = cva({
    base: "",
    variants: {
        space: {
            sm: "my-2",
            md: "my-4",
            lg: "my-8",
        },
    },
    defaultVariants: {
        space: "md",
    },
    compoundVariants: [],
});

interface HorizontalRuleProps
    extends React.HTMLAttributes<HTMLHRElement>,
        VariantProps<typeof hrVariants> {}

export function HorizontalRule({ space }: HorizontalRuleProps) {
    return (
        <hr
            className={cx(
                `h-px border-0 bg-zinc-300 dark:bg-zinc-700`,
                hrVariants({ space }),
            )}
        />
    );
}
