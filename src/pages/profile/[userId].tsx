import { User } from ".prisma/client";
import { Avatar, Button, IconButton, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { signOut, useSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
import Image from 'next/image';
import Link from 'next/link';
import { getFormattedDate } from "../../../functions/get_formatted_date";
import { getLatestDate } from "../../../functions/get_latest_date";
import { createStyles, makeStyles } from "@material-ui/styles";
import { revalidateTime } from "../../../lib/revalidate_time";
import { useState } from "react";
import { NoteWithItems } from "../../../types/note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { NoteCreateModal } from "../../components/notes/note_create.modal";
import { getSortedNotes } from "../../../functions/get_sorted_notes";

const Profile = (props: Props) => {
    const [ user, setUser ] = useState<User>(props.user);
    const [ notes, setNotes ] = useState<NoteWithItems[]>(getSortedNotes(props.notes, "0", "0"));
    const [ session ] = useSession();

    const [ noteCreateModalOpen, setNoteCreateModalOpen ] = useState<boolean>(false);

    const useStyles = makeStyles(() =>
        createStyles({
            avater: {
                margin: "5px"
            },
            listItem: {
                textAlign: "center",
                margin: "0 auto"
            },
            button: {
                width: "100%"
            },
            plusIcon: {
                padding: "0.3rem",
                fontSize: "1rem"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            <List>
                <div className="flex flex-col justify-center items-center text-center p-2">
                    <Avatar className={classes.avater}>
                        <Image src={user.image!} loading="lazy" layout="fill" alt="ログインユーザーの画像" />
                    </Avatar>
                    <ListItemText
                        primary={user.name}
                        secondary={
                            <>
                                <table>
                                    <tbody>
                                        <tr><th className="px-2">最新の投稿</th>
                                            <td className="px-2">
                                                {notes.length ? (
                                                    getFormattedDate(getLatestDate(
                                                        notes.map(note => note.createdAt)
                                                        ))
                                                        ) : "ノート無し"}
                                            </td>
                                        </tr>
                                        <tr><th className="px-2">ノート数</th><td className="px-2">{notes.length}</td></tr>
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
                <div className="text-center font-bold border-b-2 w-3/4 mx-auto relative">
                    <span>ノート一覧</span>
                    {session && (session.user.id === user.id) && (
                        <>
                            <div className="absolute right-0 bottom-0">
                                <IconButton className={classes.plusIcon} onClick={() => setNoteCreateModalOpen(true)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </IconButton>
                            </div>
                            <NoteCreateModal
                                modalOpen={noteCreateModalOpen}
                                setModalOpen={setNoteCreateModalOpen}
                            />
                        </>
                    )}
                </div>
                {notes.map(note =>
                    <Link key={note.id} href={`/items/${note.id}`} passHref>
                        <Button className={classes.button}>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    primary={<Typography variant="button" display="block" gutterBottom>{note.title}</Typography>}
                                    secondary={
                                        <>
                                            <table className="mx-auto">
                                                <tbody>
                                                    <tr>
                                                        <th className="px-2">最新の投稿</th>
                                                        <td className="px-2">{note.items.length ? getFormattedDate(
                                                                getLatestDate(note.items.map(item => item.createdAt))
                                                            ) : "投稿なし"}
                                                        </td>
                                                    </tr>
                                                    <tr><th className="px-2">作成日</th><td className="px-2">{getFormattedDate(note.createdAt)}</td></tr>
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

    return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.userId?.toString();
    const user: User | null = await prisma.user.findUnique({
        where: {
            id
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    const notes: NoteWithItems | null = await prisma.note.findMany({
        where: {
            userId: id
        },
        include: {
            items: true
        }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    return {
        props: { user, notes },
        revalidate: revalidateTime
    }
}

export default Profile;

interface Props {
    user: User
    notes: NoteWithItems[]
}