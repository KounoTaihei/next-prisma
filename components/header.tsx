import { AppBar, Avatar, Button, Drawer, IconButton, List, ListItem, Toolbar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import Image from 'next/image';
import humanImage from '../public/human.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Header = () => {
    const [ session ] = useSession();

    const useStyles = makeStyles(() => 
        createStyles({
            appBar: {
                color: "#fff",
                backgroundColor: "#3B82F6"
            },
            toolBar: {
                display: "flex",
                justifyContent: "space-between"
            },
            avatar: {
                border: "white 1px solid",
                backgroundColor: "#fff"
            },
            menu: {
                width: "70vw"
            },
            menuItem: {
                padding: "10px",
                width: "auto"
            }
        })
    );
    const classes = useStyles();

    /** メニュー */
    const [ menuOpening, setMenuOpening ] = useState<boolean>(false);

    const menuContents = (
        <List className={classes.menu}>
            <Link href="/notes">
                <ListItem
                    button
                    className={classes.menuItem}
                    onClick={() => setMenuOpening(false)}
                >
                    <Button
                        startIcon={<FontAwesomeIcon icon={faBookOpen} />}
                    >
                        ノート一覧
                    </Button>
                </ListItem>
            </Link>
        </List>
    )
    /** --- */

    return (
        <>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                    <nav>
                        <IconButton
                            color="inherit"
                            onClick={() => setMenuOpening(true)}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </IconButton>
                    </nav>
                    <nav>
                        {!session ? (
                            <>
                                <Link href="/login">
                                    <Avatar className={classes.avatar}>
                                        <Image alt="未ログインユーザーの画像" src={humanImage} layout="fill" loading="lazy" />
                                    </Avatar>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/profile">
                                    <Avatar className={classes.avatar}>
                                        <Image alt="ログインユーザーの画像" src={session.user.image} layout="fill" loading="lazy" />
                                    </Avatar>
                                </Link>
                            </>
                        )}
                    </nav>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={menuOpening}
                onClose={() => setMenuOpening(false)}
            >
                {menuContents}
            </Drawer>
        </>
    )
}

export default Header;