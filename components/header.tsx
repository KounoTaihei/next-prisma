import { AppBar, Avatar, Chip, Toolbar } from '@material-ui/core';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

const Header = () => {
    const [ session ] = useSession();

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
                            <Chip
                                avatar={<Avatar alt="ログインユーザーの画像" src={session.user.image} />}
                                label={session.user.name}
                                className="hover:opacity-90"
                            />
                        </>
                    )}
                </nav>
            </header>
        </AppBar>
    )
}

export default Header;