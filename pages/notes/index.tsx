import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import { Item, Note, User } from "@prisma/client";
import Link from "next/link";
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Image from 'next/image';
import { formatDate } from "../../functions/date.format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";

const Notes = ({ notes }: Props) => {
    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                width: "100%"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            <Link href="/notes/create"><Button>add note</Button></Link>
            <List>
                {notes.map(note =>
                    <Link href={`/items/note/${note.id}`}>
                        <Button className={classes.button}>
                            <ListItem key={note.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Image src={note.user.image!} layout="fill" loading="lazy" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <>
                                            {note.title}（{note.items.length}）
                                        </>
                                    }
                                    secondary={
                                        <>
                                            {note.user.name}<br></br>
                                            <FontAwesomeIcon icon={faPen} className="mr-1" />{formatDate(note.createdAt)}
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

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.note.findMany({
        include: {
            user: true,
            items: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    const notes: NoteWithUserAndItems[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            notes
        }
    }
}

interface NoteWithUserAndItems extends Note {
    user: User
    items: Item[]
}

interface Props {
    notes: NoteWithUserAndItems[]
}

export default Notes;