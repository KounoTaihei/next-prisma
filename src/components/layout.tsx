import { ReactChild, useEffect, useState } from "react";
import Header from "./header";
import Head from 'next/head';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { animateScroll as scroll } from 'react-scroll';
import styles from './Layout.module.scss';

const Layout = ({ children }: Props) => {
    const [ scrolled, setScrolled ] = useState<boolean>(false);

    useEffect(() => {
        const scrollCheck = () => {
            if(1000 > window.scrollY) {
                setScrolled(false);
            } else {
                setScrolled(true);
            }
        };
        window.addEventListener('scroll', scrollCheck, {
            capture: false,
            passive: true,
        });
        scrollCheck();

        return (() => {
            window.removeEventListener('scroll', scrollCheck);
        });
    },[])

    const scrollToTop = () => {
        scroll.scrollToTop();
    }

    return (
        <>
            <Head>
                <title>Note App</title>
                <meta charSet="utf-8"></meta>
            </Head>
            <Header />
            <main>{children}</main>
            <div className={scrolled ? `${styles.scroll} ${styles.active}` : styles.scroll} onClick={scrollToTop}>
                <FontAwesomeIcon icon={faChevronUp} />
            </div>
        </>
    )
}

interface Props {
    children: ReactChild
}

export default Layout;