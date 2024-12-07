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
});

interface ExternalLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof linkVariants> {}

export default function ExternalLink({
    children,
    className,
    href,
    variant,
}: PropsWithChildren<ExternalLinkProps>) {
    return (
        <a href={href} className={cx(linkVariants({ className, variant }))}>
            {children}
        </a>
    );
}
