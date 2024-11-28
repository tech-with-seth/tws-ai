import { ReactNode } from 'react';
import { VariantProps } from 'cva';

import { cva, cx } from 'cva.config';

export const headingVariants = cva({
    base: 'text-zinc-800 dark:text-white font-bold',
    variants: {
        as: {
            h1: 'text-4xl',
            h2: 'text-3xl',
            h3: 'text-2xl',
            h4: 'text-xl',
            h5: 'text-lg',
            h6: 'text-base'
        }
    },
    defaultVariants: {
        as: 'h2'
    },
    compoundVariants: []
});

export interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headingVariants> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: ReactNode;
}

export function Heading({ as, children, className }: HeadingProps) {
    const Component = as || 'h2';

    return (
        <Component className={cx(headingVariants({ as }), className)}>
            {children}
        </Component>
    );
}
