import { cx } from "cva.config";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Button } from "~/components/Button";
import { Drawer } from "~/components/Drawer";
import { useDrawer } from "~/hooks/useDrawer";
import { Paths } from "~/utils/paths";

export default function DrawerLayout() {
    const navigate = useNavigate();

    const { isDrawerOpen, closeDrawer } = useDrawer({
        openOnRender: true,
        onClose: () => navigate(Paths.DASHBOARD),
    });

    const [drawerSize, setDrawerSize] = useState<"sm" | "md" | "lg">("md");

    return (
        <Drawer
            handleClose={closeDrawer}
            id="createDrawer"
            isOpen={isDrawerOpen}
            position="right"
            size={drawerSize}
            aux={
                <div className="flex items-center gap-2">
                    <Button
                        className={cx(
                            drawerSize === "sm" &&
                                "border-primary-500 dark:border-primary-500",
                        )}
                        variant="outline"
                        onClick={() => setDrawerSize("sm")}
                        size="sm"
                    >
                        SM
                    </Button>
                    <Button
                        className={cx(
                            drawerSize === "md" &&
                                "border-primary-500 dark:border-primary-500",
                        )}
                        variant="outline"
                        onClick={() => setDrawerSize("md")}
                        size="sm"
                    >
                        MD
                    </Button>
                    <Button
                        className={cx(
                            drawerSize === "lg" &&
                                "border-primary-500 dark:border-primary-500",
                        )}
                        variant="outline"
                        onClick={() => setDrawerSize("lg")}
                        size="sm"
                    >
                        LG
                    </Button>
                </div>
            }
        >
            <Outlet />
        </Drawer>
    );
}
