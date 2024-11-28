import { cx, VariantProps } from "cva";
import { cardVariants } from "./Card";

interface RadioCardProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof cardVariants> {}

export function RadioCard({
    children,
    className,
    id,
    border,
    ...rest
}: RadioCardProps) {
    return (
        <div>
            <input id={id} className="peer hidden" type="radio" {...rest} />
            <label
                htmlFor={id}
                className={cx(
                    cardVariants({ border }),
                    "inline-block cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 dark:peer-checked:text-primary-500",
                    className,
                )}
            >
                {children}
            </label>
        </div>
    );
}
