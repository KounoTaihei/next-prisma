import { AppBar, Avatar, Toolbar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import Image from 'next/image';
import humanImage from '../public/human.svg';

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
                border: "white 1px solid"
            }
        })
    );
    
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <nav >
                    <Link href="/"><a className="text-white p-2">Top</a></Link>
                    <Link href="/notes"><a className="text-white p-2">Notes</a></Link>
                </nav>
                <nav>
                    {!session && (
                        <>
                            <Avatar>
                                <Image alt="未ログインユーザーの画像" src={humanImage} layout="fill" loading="lazy" />
                            </Avatar>
                        </>
                    )}
                    {session && (
                        <>
                            <Avatar className={classes.avatar}>
                                <Image alt="ログインユーザーの画像" src={session.user.image} layout="fill" loading="lazy" />
                            </Avatar>
                        </>
                    )}
                </nav>
            </Toolbar>
        </AppBar>
    )
}

export default Header;