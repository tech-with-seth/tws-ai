import type { Config } from "tailwindcss";
import { amber, blue, emerald, green, rose } from "tailwindcss/colors";
import Color from "color";

type ShadeKey =
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "950";

// const desaturated = (colorObj: Record<ShadeKey, string>) =>
//     Object.keys(colorObj).reduce(
//         (colorObj, shadeNumber) => ({
//             ...colorObj,
//             [shadeNumber]: Color(colorObj[shadeNumber as ShadeKey])
//                 .desaturate(0.3)
//                 .hex(),
//         }),
//         {} as Record<ShadeKey, string>,
//     );

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
                secondary: blue,
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
