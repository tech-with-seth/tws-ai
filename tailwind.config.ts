import type { Config } from "tailwindcss";
import {
    amber,
    emerald,
    green,
    purple,
    rose,
    sky,
    yellow,
} from "tailwindcss/colors";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '"Inter"',
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
            colors: {
                primary: emerald,
                secondary: purple,
                success: green,
                warning: amber,
                danger: rose,
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
    ],
} satisfies Config;
