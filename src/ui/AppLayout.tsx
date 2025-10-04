import type { JSX } from "react";
import { Outlet } from "react-router";

function AppLayout(): JSX.Element {
    return (
        <div>
            <p>App Layout</p>
            <Outlet />
        </div>
    );
}

export default AppLayout;
