import type React from "react";
import { createContext, useContext, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

type StyledListProps = {
    $position: {
        x: number;
        y: number;
    } | null;
    ref: React.RefObject<HTMLDivElement | null>;
};

const StyledList = styled.ul<StyledListProps>`
    position: fixed;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    right: ${(props) => props.$position?.x}px;
    top: ${(props) => props.$position?.y}px;
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

type MenusContextType = {
    openId: number | null;
    close: () => void;
    open: (id: number) => void;
    position: { x: number; y: number } | null;
    setPosition: React.Dispatch<
        React.SetStateAction<{
            x: number;
            y: number;
        } | null>
    >;
};

const MenusContext = createContext<MenusContextType | undefined>(undefined);

function useMenusContext() {
    const context = useContext(MenusContext);
    if (!context) {
        throw new Error(
            "Menus compound components must be used within <Menus>"
        );
    }
    return context;
}

type MenusProps = {
    children: React.ReactNode;
};

function Menus({ children }: MenusProps) {
    const [openId, setOpenId] = useState<number | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null
    );
    const close = () => setOpenId(null);
    const open = setOpenId;

    return (
        <MenusContext.Provider
            value={{ openId, open, close, position, setPosition }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }: { id: number }) {
    const { openId, close, open, setPosition } = useMenusContext();

    function handleClick(e: React.MouseEvent<HTMLElement>) {
        const target = e.target as Element;
        const button = target.closest("button");
        if (!button) return;

        const rect = button.getBoundingClientRect();
        setPosition({
            x: window.innerWidth - rect.width - rect.x,
            y: rect.y + rect.height + 8,
        });

        if (openId === null || openId !== id) open(id);
        else close();
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ children, id }: { children: React.ReactNode; id: number }) {
    const { openId, position, close } = useMenusContext();
    const ref = useOutsideClick(close);

    if (openId !== id) return null;

    return createPortal(
        <StyledList $position={position} ref={ref}>
            {children}
        </StyledList>,
        document.body
    );
}

function Button({
    children,
    icon,
    onClick,
}: {
    children: React.ReactNode;
    icon: JSX.Element;
    onClick?: () => void;
}) {
    const { close } = useMenusContext();

    function handleClick() {
        onClick?.();
        close();
    }

    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}

type CompoundMenus = React.FC<{ children: React.ReactNode }> & {
    Toggle: typeof Toggle;
    List: typeof List;
    Button: typeof Button;
    Menu: typeof Menu;
};

(Menus as CompoundMenus).Menu = Menu;
(Menus as CompoundMenus).Toggle = Toggle;
(Menus as CompoundMenus).List = List;
(Menus as CompoundMenus).Button = Button;

export default Menus as CompoundMenus;
