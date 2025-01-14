import { useState } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cx } from "cva.config";

type ComboBoxOption = { id: string; label: string };

interface ComboBoxProps {
    id: string;
    name: string;
    options: ComboBoxOption[];
}

export function ComboBox({ id, name, options }: ComboBoxProps) {
    const [selected, setSelected] = useState(options[0]);
    const [query, setQuery] = useState("");

    const filteredOptions =
        query === ""
            ? options
            : options.filter((options) => {
                  return options.label
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    return (
        <Combobox
            value={selected}
            onChange={(value) =>
                setSelected(
                    options.find((o) => o.id === value?.id) || options[0],
                )
            }
            onClose={() => setQuery("")}
        >
            <div className="relative">
                <ComboboxInput
                    id={id}
                    name={name}
                    className={cx(
                        "w-full rounded-lg border-none bg-zinc-200 py-1.5 pl-3 pr-8 text-sm/6 text-white dark:bg-zinc-700",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                    )}
                    displayValue={(option: ComboBoxOption) => option?.label}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDownIcon className="size-4" />
                </ComboboxButton>
            </div>
            <ComboboxOptions
                anchor="bottom"
                transition
                className={cx(
                    "w-[var(--input-width)] rounded-xl border p-1 [--anchor-gap:var(--spacing-1)] empty:invisible dark:border-zinc-800 dark:bg-zinc-700",
                    "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
                )}
            >
                {filteredOptions.map((option) => (
                    <ComboboxOption
                        key={option.id}
                        value={option}
                        className="group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                    >
                        <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
                        <div className="text-sm/6 text-white">
                            {option.label}
                        </div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
