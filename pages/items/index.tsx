import { Item } from "@prisma/client";
import { GetStaticProps } from "next";
import Link from "next/link";
import prisma from "../../lib/prisma";

const Items = ({ items }: Props) => {
    return (
        <>
            <Link href="/items/create"><a>add item</a></Link>
            {items.map(item => <p key={item.id}>{item.title}</p>)}
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.item.findMany();
    const items: Item[] = await JSON.parse(JSON.stringify(res));

    return {
        props: { items }
    }
}

interface Props {
    items: Item[]
}

export default Items;