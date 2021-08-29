import { ReactChild } from "react";

const Layout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}

interface Props {
    children: ReactChild
}