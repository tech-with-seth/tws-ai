import { useEffect, useState } from "react";

interface UseDrawerConfig {
    initialState?: boolean;
    openOnRender?: boolean;
    onClose?: () => void;
    delay?: number;
}

export function useDrawer({
    initialState = false,
    openOnRender,
    onClose,
    delay = 150,
}: UseDrawerConfig = {}) {
    const [isDrawerOpen, setDrawerOpen] = useState(initialState);

    useEffect(() => {
        if (openOnRender) {
            setTimeout(() => {
                setDrawerOpen(true);
            }, delay ?? 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        isDrawerOpen,
        closeDrawer: () => {
            setDrawerOpen(false);
            setTimeout(() => {
                onClose?.();
            }, delay);
        },
        openDrawer: () => {
            setDrawerOpen(true);
        },
        toggleDrawer: () => {
            setDrawerOpen((prev) => !prev);
        },
    };
}
