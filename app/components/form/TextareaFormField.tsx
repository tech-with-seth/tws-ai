import { TextareaField, TextareaFieldProps } from "./TextareaField";

interface TextareaFormFieldProps extends TextareaFieldProps {
    label: string;
    helperText?: string;
    errorText?: string | string[];
}

export function TextareaFormField({
    errorText,
    helperText,
    id,
    label,
    ...rest
}: TextareaFormFieldProps) {
    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className={`text-lg font-bold ${helperText ? "" : "mb-2"}`}
            >
                {label}
            </label>
            {helperText && (
                <p className="mb-2 text-sm text-zinc-800 dark:text-zinc-400">
                    {helperText}
                </p>
            )}
            <TextareaField id={id} {...rest} />
            {errorText && <p className="text-red-500">{errorText}</p>}
        </div>
    );
}
