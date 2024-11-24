import TextField, { TextFieldProps } from './TextField';

interface TextFormFieldProps extends TextFieldProps {
    label: string;
    helperText?: string;
    errorText?: string | string[];
}

export default function TextFormField({
    errorText,
    helperText,
    id,
    label,
    ...rest
}: TextFormFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>{label}</label>
            {helperText && <p className="text-zinc-500">{helperText}</p>}
            <TextField id={id} {...rest} />
            {errorText && <p className="text-red-500">{errorText}</p>}
        </div>
    );
}
