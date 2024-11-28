import TextField, { TextFieldProps } from './TextField';

interface TextFormFieldProps extends TextFieldProps {
    label: string;
    helperText?: string;
    errorText?: string | string[];
}

export function TextFormField({
    errorText,
    helperText,
    id,
    label,
    ...rest
}: TextFormFieldProps) {
    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className={`font-bold text-lg ${helperText ? '' : 'mb-2'}`}
            >
                {label}
            </label>
            {helperText && (
                <p className="text-zinc-300 dark:text-zinc-400 text-sm mb-2">
                    {helperText}
                </p>
            )}
            <TextField id={id} {...rest} />
            {errorText && <p className="text-red-500">{errorText}</p>}
        </div>
    );
}
