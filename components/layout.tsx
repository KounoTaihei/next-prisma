import { ReactChild } from "react";
import Header from "./header";

const Layout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <main className="p-2">{children}</main>
        </>
    )
}

interface Props {
    children: ReactChild
}

export default Layout;