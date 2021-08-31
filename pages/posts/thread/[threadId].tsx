import { Post, Thread } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../../lib/prisma";

const apiUrl = process.env.API_URL;

const FindPostsByThreadId = ({ posts }: Props) => {
    return (
        <>
            <ul>
            {posts.map(post => 
                <li key={post.id}>
                    <p>create: {post.createdAt}</p>
                    <p>title: {post.title}</p>
                    <p>body: {post.body}</p>
                </li>
            )}
            </ul>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const threads: Thread[] = await prisma.thread.findMany();
    const paths = threads.map(thread => `/posts/thread/${thread.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const threadId = params?.threadId?.toString();
    const res = await prisma.post.findMany({
        where: {
            threadId
        }
    });
    const posts: Post[] = await JSON.parse(JSON.stringify(res));
    
    return {
        props: { posts }
    }
}

interface Props {
    posts: Post[]
}

export default FindPostsByThreadId;