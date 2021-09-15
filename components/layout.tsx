import { ReactChild } from "react";
import Header from "./header";
import Head from 'next/head';

const Layout = ({ children }: Props) => {
    return (
        <>
            <Head>
                <title>Note App</title>
            </Head>
            <Header />
            <main>{children}</main>
        </>
    )
}

interface Props {
    children: ReactChild
}

export default Layout;