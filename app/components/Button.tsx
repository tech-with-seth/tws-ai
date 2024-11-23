import type { VariantProps } from 'cva';
import { cva, cx } from 'cva.config';
import { PropsWithChildren } from 'react';

export const buttonVariants = cva({
    base: 'px-4 py-3 rounded-md text-white',
    variants: {
        variant: {
            primary: 'bg-primary-500 hover:bg-primary-600',
            secondary: 'bg-gray-500 hover:bg-gray-600'
        },
        size: {}
    },
    defaultVariants: {
        variant: 'primary'
    },
    compoundVariants: []
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    className?: string;
}

export function Button({
    children,
    className,
    variant,
    size,
    type
}: PropsWithChildren<ButtonProps>) {
    return (
        <button
            className={cx(
                buttonVariants({
                    variant,
                    size
                }),
                className
            )}
            type={type}
        >
            {children}
        </button>
    );
}
