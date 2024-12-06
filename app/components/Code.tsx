import { PropsWithChildren, useEffect } from "react";
import Prism from "prismjs";

interface CodeProps {
    lang: "ts" | "tsx" | "js" | "jsx" | "json" | "html" | "css";
}

export function Code({ children, lang = "ts" }: PropsWithChildren<CodeProps>) {
    useEffect(() => {
        Prism.highlightAll();
    }, [children]);

    return (
        <pre className="block overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-700 bg-zinc-100 p-6 dark:bg-black">
            <code
                className={`break-words text-sm text-zinc-800 dark:text-zinc-200 language-${lang}`}
            >
                {children}
            </code>
        </pre>
    );
}
