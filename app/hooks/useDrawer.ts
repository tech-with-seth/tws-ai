import { useCallback, useEffect, useState } from "react";

export function useDrawer({
    openOnRender,
    onClose,
    delay = 150,
}: {
    openOnRender?: boolean;
    onClose?: () => void;
    delay?: number;
}) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (openOnRender) {
            setTimeout(() => {
                setDrawerOpen(true);
            }, delay ?? 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openDrawer = useCallback(() => {
        if (delay) {
            setTimeout(() => {
                setDrawerOpen(true);
            }, delay);
        } else {
            setDrawerOpen(true);
        }
    }, [delay]);

    return {
        isDrawerOpen,
        closeDrawer: () => {
            setDrawerOpen(false);
            setTimeout(() => {
                onClose?.();
            }, delay);
        },
        openDrawer,
        toggleDrawer: () => {
            setDrawerOpen((prev) => !prev);
        },
    };
}
