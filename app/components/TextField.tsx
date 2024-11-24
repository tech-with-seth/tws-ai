import { cva, cx } from 'cva.config';

export interface TextFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

export const textFieldVariants = cva({
    base: 'p-2 border border-zinc-300 dark:border-zinc-600 rounded-md',
    variants: {
        hasError: {
            true: 'border-red-500 dark:border-red-600'
        }
    },
    defaultVariants: {},
    compoundVariants: []
});

export default function TextField({ type }: TextFieldProps) {
    return <input className={cx(textFieldVariants({}))} type={type} />;
}
