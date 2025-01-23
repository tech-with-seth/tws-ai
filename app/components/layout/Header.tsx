import { Link, useNavigate } from "react-router";
import { Paths } from "~/utils/paths";
import { ButtonNavLink } from "~/components/ButtonNavLink";
import { BotIcon, LockIcon, MenuIcon, ZapIcon } from "lucide-react";
import { User } from "@prisma/client";
import { Drawer } from "../Drawer";
import { useDrawer } from "~/hooks/useDrawer";
import { Button } from "../Button";

interface HeaderProps {
    isAdmin: boolean;
    user?: Pick<User, "email">;
}

export function Header({ isAdmin, user }: HeaderProps) {
    const { isDrawerOpen, closeDrawer, openDrawer } = useDrawer({});

    return (
        <>
            <header className="p-4">
                <nav className="flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-300 p-4 dark:border-zinc-600 dark:bg-zinc-700">
                    <ul className="mr-4 flex items-center gap-4">
                        <li>
                            <Link to={Paths.DASHBOARD} className="font-bold">
                                TWS AI
                            </Link>
                        </li>
                        <li className="hidden lg:block">
                            <ButtonNavLink to={Paths.DASHBOARD}>
                                Dashboard
                            </ButtonNavLink>
                        </li>
                        <li className="hidden lg:block">
                            <ButtonNavLink
                                iconBefore={<BotIcon className="h-4 w-4" />}
                                to={Paths.ASSISTANTS}
                            >
                                Assistants
                            </ButtonNavLink>
                        </li>
                        <li className="hidden lg:block">
                            <ButtonNavLink
                                iconBefore={<ZapIcon className="h-4 w-4" />}
                                to={Paths.AGENTS}
                            >
                                Agents
                            </ButtonNavLink>
                        </li>
                    </ul>
                    <ul className="lg:flex lg:items-center lg:gap-4">
                        <li className="hidden lg:block">
                            <ButtonNavLink to={Paths.PROFILE}>
                                {user?.email}
                            </ButtonNavLink>
                        </li>
                        {isAdmin && (
                            <li className="hidden lg:block">
                                <ButtonNavLink
                                    iconBefore={
                                        <LockIcon className="h-4 w-4" />
                                    }
                                    to={Paths.LABS}
                                >
                                    Admin
                                </ButtonNavLink>
                            </li>
                        )}
                        <li className="hidden lg:block">
                            <ButtonNavLink to={Paths.LOGOUT}>
                                Logout
                            </ButtonNavLink>
                        </li>
                        <li className="block lg:hidden">
                            <Button onClick={openDrawer} size="sm">
                                <MenuIcon />
                            </Button>
                        </li>
                    </ul>
                </nav>
            </header>
            <Drawer
                size="md"
                id="mobileNav"
                isOpen={isDrawerOpen}
                handleClose={closeDrawer}
                containerClassName="p-4"
                position="right"
            >
                <div className="flex flex-col gap-4">
                    <ButtonNavLink to={Paths.PROFILE}>
                        {user?.email}
                    </ButtonNavLink>
                    <ButtonNavLink to={Paths.LOGOUT}>Logout</ButtonNavLink>
                </div>
            </Drawer>
        </>
    );
}
