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
        <pre className="block overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-700 bg-gray-100 p-6 dark:bg-black">
            <code
                className={`break-words text-sm text-gray-800 dark:text-gray-200 language-${lang}`}
            >
                {children}
            </code>
        </pre>
    );
}
