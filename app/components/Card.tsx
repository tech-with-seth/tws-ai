import { VariantProps } from 'cva';
import { cva, cx } from 'cva.config';
import { PropsWithChildren } from 'react';

export const cardVariants = cva({
    base: 'bg-white dark:bg-zinc-800 rounded-lg',
    variants: {
        border: {
            true: 'border border-zinc-200 dark:border-zinc-600',
            false: 'border-0'
        },
        padding: {
            none: 'p-0',
            sm: 'p-2',
            md: 'p-4',
            lg: 'p-6'
        }
    },
    defaultVariants: {
        border: true,
        padding: 'md'
    },
    compoundVariants: []
});

export interface CardProps extends VariantProps<typeof cardVariants> {
    className?: string;
}

export default function Card({
    border,
    children,
    className
}: PropsWithChildren<CardProps>) {
    return (
        <div className={cx(cardVariants({ border }), className)}>
            {children}
        </div>
    );
}
