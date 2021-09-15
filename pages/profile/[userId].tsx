import { User } from ".prisma/client";
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { UserWithNotesWithItems } from "../../types/user";
import prisma from "../../lib/prisma";
import Image from 'next/image';
import Link from 'next/link';
import { getFormattedDate } from "../../functions/get_formatted_date";
import { getLatestDate } from "../../functions/get_latest_date";
import { createStyles, makeStyles } from "@material-ui/styles";

const Profile = ({ user }: Props) => {
    const [ session ] = useSession();
    const router = useRouter();

    const useStyles = makeStyles(() =>
        createStyles({
            listItem: {
                textAlign: "center",
                margin: "0 auto"
            },
            button: {
                width: "100%"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            <List>
                <div className="flex flex-col justify-center items-center text-center p-2">
                    <ListItemAvatar>
                        <Avatar>
                            <Image src={user.image!} loading="lazy" layout="fill" alt="ログインユーザーの画像" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.name}
                        secondary={
                            <>
                                <table>
                                    <tbody>
                                        <tr><th className="px-2">登録日</th><td className="px-2">{getFormattedDate(user.createdAt)}</td></tr>
                                        <tr><th className="px-2">ノート数</th><td className="px-2">{user.notes.length}</td></tr>
                                        <tr><th className="px-2">最後の投稿</th><td className="px-2">{getFormattedDate(getLatestDate(
                                            user.notes.map(note => note.createdAt)
                                        ))}</td></tr>
                                    </tbody>
                                </table>
                            </>
                        }
                    />
                    {session?.user.id === user.id &&
                        <Button variant="contained" color="secondary" onClick={() => signOut()}>ログアウト</Button>
                    }
                </div>
            </List>
            <List>
                <div className="text-center font-bold border-b-2 w-3/4 mx-auto">ノート一覧</div>
                {user.notes.map(note =>
                    <Link key={note.id} href={`/items/${note.id}`} passHref>
                        <Button className={classes.button}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={<Typography variant="button" display="block" gutterBottom>{note.title}</Typography>}
                                    secondary={
                                        <>
                                            <table className="mx-auto">
                                                <tbody>
                                                    <tr><th className="px-2">作成日</th><td className="px-2">{getFormattedDate(note.createdAt)}</td></tr>
                                                    <tr>
                                                        <th className="px-2">最後の投稿</th>
                                                        <td className="px-2">{note.items.length ? getFormattedDate(
                                                                getLatestDate(note.items.map(item => item.createdAt))
                                                            ) : "アイテムなし"}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </>
                                    }
                                />
                            </ListItem>
                        </Button>
                    </Link>
                )}
            </List>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const users: User[] = await prisma.user.findMany();
    const paths = users.map(user => `/profile/${user.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.userId?.toString();
    const user: User | null = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            notes: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    items: true
                }
            }
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    return {
        props: { user }
    }
}

export default Profile;

interface Props {
    user: UserWithNotesWithItems
}