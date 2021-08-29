import Link from 'next/link';

const Header = () => {
    return (
        <header className="p-2 bg-red-300">
            <nav>
                <Link href="/threads"><a className="text-white p-2">Threads</a></Link>
                <Link href="/posts"><a className="text-white p-2">Posts</a></Link>
            </nav>
        </header>
    )
}

export default Header;