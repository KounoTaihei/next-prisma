import { GetStaticProps } from "next";
import axios from "axios";
import { API_URL } from "../../environments/environments";
import { Post, Thread } from "@prisma/client";
import Link from "next/link";

const apiUrl = API_URL + "/threads";

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
    const res = await axios.get(apiUrl);
    const threads = res.data;

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