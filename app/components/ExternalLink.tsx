import { VariantProps } from "cva";
import { cva, cx } from "cva.config";
import { PropsWithChildren } from "react";

export const linkVariants = cva({
    base: "text-primary-500 hover:text-primary-600 underline",
    variants: {
        variant: {
            primary: "",
        },
    },
    defaultVariants: {
        variant: "primary",
    },
    compoundVariants: [],
});

interface ExternalLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof linkVariants> {}

export default function ExternalLink({
    children,
    href,
    variant,
}: PropsWithChildren<ExternalLinkProps>) {
    return (
        <a href={href} className={cx(linkVariants({ variant }))}>
            {children}
        </a>
    );
}
