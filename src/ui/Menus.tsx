import type React from "react";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

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
    };
};

const StyledList = styled.ul<StyledListProps>`
    position: fixed;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    right: ${(props) => props.$position.x}px;
    top: ${(props) => props.$position.y}px;
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
    openId: string;
    close: (id: string) => void;
    open: () => void;
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
    const [openId, setOpenId] = useState("");
    const close = () => setOpenId("");
    const open = () => setOpenId;

    return (
        <MenusContext.Provider value={{ openId, open, close }}>
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }: { id: number }) {
    const { openId, close, open } = useMenusContext();

    function handleClick() {
        openId === "" || openId !== id ? open(id) : close();
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ children, id }: { children: React.ReactNode; id: number }) {
    const { openId } = useMenusContext();

    if (+openId !== id) return null;

    return createPortal(
        <StyledList $position={{ x: 20, y: 20 }}>{children}</StyledList>,
        document.body
    );
}

function Button({ children }: { children: React.ReactNode }) {
    return (
        <li>
            <StyledButton>{children}</StyledButton>
        </li>
    );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
