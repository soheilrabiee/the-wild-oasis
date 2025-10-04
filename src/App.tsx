import type { JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

function App(): JSX.Element {
    return (
        <>
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    {/* when we want to have a root route in our structure but we don't have a page for that, so we just replace it with what we want */}
                    <Route
                        index
                        element={<Navigate replace to="dashboard" />}
                    />

                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="cabins" element={<Cabins />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="account" element={<Account />} />
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
