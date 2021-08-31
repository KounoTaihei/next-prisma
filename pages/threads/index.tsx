import { GetStaticProps } from "next";
import { Post, Thread } from "@prisma/client";
import Link from "next/link";
import prisma from "../../lib/prisma";

const Threads = ({ threads }: Props) => {
    return (
        <>
            <Link href="/threads/create"><a>add thread</a></Link>
            <ul>
                {threads.map(thread =>
                    <li key={thread.id}>
                        <p>title: <Link href={`/threads/${thread.id}`}><a>{thread.title}</a></Link></p>
                        <p>posts: <Link href={`/posts/thread/${thread.id}`}><a>{thread.posts.length}</a></Link></p>
                    </li>    
                )}
            </ul>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.thread.findMany({
        include: {
            posts: true
        }
    });
    const threads: ThreadWithPosts[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            threads
        }
    }
}

interface ThreadWithPosts extends Thread {
    posts: Post[]
}

interface Props {
    threads: ThreadWithPosts[]
}

export default Threads;