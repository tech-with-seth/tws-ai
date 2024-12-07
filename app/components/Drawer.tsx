import { PropsWithChildren } from "react";
import {
    PanelBottomCloseIcon,
    PanelLeftCloseIcon,
    PanelRightCloseIcon,
} from "lucide-react";
import { cva, cx } from "cva.config";
import { Button } from "./Button";

const drawerVariants = cva({
    base: `fixed z-50 transition-transform bg-white dark:bg-zinc-900`,
    variants: {
        position: {
            left: "border-r border-r-zinc-300 dark:border-r-zinc-600 top-0 left-0 h-screen -translate-x-full sm:rounded-tr-xl sm:rounded-br-xl",
            right: "top-0 right-0 h-screen translate-x-full sm:rounded-tl-xl sm:rounded-bl-xl border-l border-l-zinc-300 dark:border-l-zinc-600",
            bottom: "w-full bottom-0 translate-y-full sm:rounded-tl-xl sm:rounded-tr-xl",
        },
        isOpen: {
            true: "transform-none",
        },
        size: {
            sm: "w-full sm:w-1/2 md:w-1/4",
            md: "w-full sm:w-1/2",
            lg: "w-full sm:w-3/4 md:w-4/5",
            full: "w-[calc(100vw_-_75px)]",
        },
    },
    compoundVariants: [
        {
            position: "bottom",
            size: "sm",
            className: "w-full h-96",
        },
        {
            position: "bottom",
            size: "md",
            className: "w-full h-1/2",
        },
        {
            position: "bottom",
            size: "lg",
            className: "w-full h-3/4",
        },
        {
            position: "bottom",
            size: "full",
            className: "w-full h-[calc(100vh_-_25px)] mt-4",
        },
    ],
    defaultVariants: {
        position: "left",
    },
});

interface DrawerProps {
    id: string;
    aux?: React.ReactNode;
    backdrop?: boolean;
    className?: string;
    containerClassName?: string;
    heading?: string;
    isOpen?: boolean;
    handleClose?: () => void;
    position?: "left" | "right" | "bottom";
    size?: "sm" | "md" | "lg" | "full";
}

export function Drawer({
    aux,
    children,
    className,
    containerClassName,
    id,
    isOpen = false,
    position = "left",
    handleClose,
    backdrop = true,
    size = "sm",
}: PropsWithChildren<DrawerProps>) {
    const orientedIcon =
        position === "bottom" ? (
            <PanelBottomCloseIcon />
        ) : position === "left" ? (
            <PanelLeftCloseIcon />
        ) : position === "right" ? (
            <PanelRightCloseIcon />
        ) : null;

    const drawerClassName = cx(
        drawerVariants({ className, position, size, isOpen }),
    );

    const overlayClassName = `fixed inset-0 z-40 bg-zinc-300 transition-opacity dark:bg-zinc-900 ${
        isOpen ? "opacity-85" : "opacity-0"
    }`;

    return (
        <>
            <div
                id={id}
                className={drawerClassName}
                tabIndex={-1}
                aria-labelledby={`${id}-label`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex justify-between gap-2 border-b border-b-zinc-400 p-4 dark:border-b-zinc-600">
                        <Button
                            variant="outline"
                            iconBefore={orientedIcon ?? <PanelLeftCloseIcon />}
                            onClick={handleClose}
                        />
                        <div>{aux}</div>
                    </div>
                    <div
                        className={cx(
                            "flex-1 overflow-y-auto",
                            containerClassName,
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {backdrop && (
                <div onClick={handleClose} className={overlayClassName} />
            )}
        </>
    );
}
