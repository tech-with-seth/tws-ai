import { PropsWithChildren } from 'react';
import {
    PanelBottomCloseIcon,
    PanelLeftCloseIcon,
    PanelRightCloseIcon
} from 'lucide-react';
import { cva, cx } from 'cva.config';
import { Button } from './Button';

interface DrawerProps {
    id: string;
    backdrop?: boolean;
    className?: string;
    containerClassName?: string;
    heading?: string;
    isOpen?: boolean;
    handleClose?: () => void;
    position?: 'left' | 'right' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'full';
}

const drawerVariants = cva({
    base: `fixed z-50 transition-transform bg-white dark:bg-zinc-900 border-r dark:border-r-zinc-700 border dark:border-zinc-700`,
    variants: {
        position: {
            left: `top-0 left-0 h-screen -translate-x-full rounded-tr-lg rounded-br-lg`,
            right: `top-0 right-0 h-screen translate-x-full rounded-tl-lg rounded-bl-lg`,
            bottom: `w-full bottom-0 translate-y-full rounded-tl-lg rounded-tr-lg`
        },
        isOpen: {
            true: 'transform-none'
        },
        size: {
            sm: 'w-96',
            md: 'w-1/2',
            lg: 'w-3/4',
            full: 'w-[calc(100vw_-_75px)]'
        }
    },
    compoundVariants: [
        {
            position: 'bottom',
            size: 'sm',
            className: 'w-full h-96'
        },
        {
            position: 'bottom',
            size: 'md',
            className: 'w-full h-1/2'
        },
        {
            position: 'bottom',
            size: 'lg',
            className: 'w-full h-3/4'
        },
        {
            position: 'bottom',
            size: 'full',
            className: 'w-full h-[calc(100vh_-_25px)] mt-4'
        }
    ],
    defaultVariants: {
        position: 'left'
    }
});

export function Drawer({
    children,
    className,
    containerClassName,
    id,
    isOpen = false,
    position = 'left',
    handleClose,
    backdrop = true,
    size = 'sm'
}: PropsWithChildren<DrawerProps>) {
    const orientedIcon =
        position === 'bottom' ? (
            <PanelBottomCloseIcon />
        ) : position === 'left' ? (
            <PanelLeftCloseIcon />
        ) : position === 'right' ? (
            <PanelRightCloseIcon />
        ) : null;

    return (
        <>
            <div
                id={id}
                className={cx(
                    drawerVariants({ position, className, size, isOpen })
                )}
                tabIndex={-1}
                aria-labelledby={`${id}-label`}
            >
                <div className="flex flex-col h-full">
                    <div className="border-b dark:border-zinc-700 p-4">
                        <Button variant="icon" onClick={handleClose}>
                            {orientedIcon}
                        </Button>
                    </div>
                    <div
                        className={cx(
                            'flex-1 overflow-y-auto',
                            containerClassName
                        )}
                    >
                        {children}
                    </div>
                </div>
            </div>
            {backdrop && (
                <div
                    onClick={handleClose}
                    className={`fixed inset-0 z-40 bg-zinc-300 dark:bg-zinc-900 transition-opacity ${
                        isOpen ? 'opacity-85' : 'opacity-0'
                    }`}
                />
            )}
        </>
    );
}
