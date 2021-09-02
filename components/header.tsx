import Link from 'next/link';

const Header = () => {
    return (
        <header className="p-2 bg-red-300">
            <nav>
                <Link href="/"><a className="text-white p-2">Top</a></Link>
                <Link href="/notes"><a className="text-white p-2">Notes</a></Link>
                <Link href="/items"><a className="text-white p-2">Items</a></Link>
            </nav>
        </header>
    )
}

export default Header;