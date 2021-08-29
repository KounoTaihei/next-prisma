import Link from 'next/link';

const Header = () => {
    return (
        <header className="p-2 bg-red-300">
            <nav>
                <Link href="/threads"><a className="text-white">Threads</a></Link>
            </nav>
        </header>
    )
}

export default Header;