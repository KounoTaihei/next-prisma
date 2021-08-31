import { Post, Thread } from "@prisma/client";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";

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
    const threads: Thread[] = await axios.get(`${apiUrl}/threads`).then(v => v.data);
    const paths = threads.map(thread => `/posts/thread/${thread.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const threadId = params?.threadId?.toString();

    const posts: Post[] = await axios.get(`${apiUrl}/posts/thread/${threadId}`).then(v => v.data);
    return {
        props: { posts }
    }
}

interface Props {
    posts: Post[]
}

export default FindPostsByThreadId;