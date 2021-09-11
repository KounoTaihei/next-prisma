import { AppBar, Avatar, Chip, Menu, MenuItem } from '@material-ui/core';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
    const [ session ] = useSession();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color="inherit">
            <header className="bg-green-300 p-2 flex justify-between items-center">
                <nav className="">
                    <Link href="/"><a className="text-white p-2">Top</a></Link>
                    <Link href="/notes"><a className="text-white p-2">Notes</a></Link>
                </nav>
                <nav className="">
                    {!session && (
                        <>
                            not login
                        </>
                    )}
                    {session && (
                        <>
                            <span onClick={handleClick} className="hover:opacity-90" aria-controls="simple-menu" aria-haspopup="true">
                            <div className="rounded-full border">
                                <Avatar>
                                    <Image alt="ログインユーザーの画像" src={session.user.image} layout="fill" loading="lazy" />
                                </Avatar>
                            </div>
                            </span>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem>
                                    <Link href=""><a>プロフィール</a></Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href=""><a>ノート一覧</a></Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href=""><a>ログアウト</a></Link>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </nav>
            </header>
        </AppBar>
    )
}

export default Header;