import Head from "next/head";
import { ReactChild } from "react";

const Layout = ({ children }: Props) => {
    return (
        <>
            <Head
            {children}
        </>
    )
}

interface Props {
    children: ReactChild
}

export default Layout;