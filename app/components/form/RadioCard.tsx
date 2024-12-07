import { VariantProps } from "cva";
import { cardVariants } from "~/components/Card";

interface RadioCardProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof cardVariants> {}

export function RadioCard({
    children,
    className,
    id,
    border,
    name,
    value,
    ...rest
}: RadioCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-300 p-4 dark:border-zinc-600">
            <input
                id={id}
                type="radio"
                value={value}
                name={name}
                className="h-4 w-4 border-zinc-300 bg-gray-100 text-zinc-700 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-700 dark:ring-offset-zinc-600 dark:focus:ring-zinc-700"
                {...rest}
            />
            <label
                htmlFor={id}
                className="w-full text-sm font-medium text-gray-900 dark:text-gray-300"
            >
                {children}
            </label>
        </div>
    );
}
