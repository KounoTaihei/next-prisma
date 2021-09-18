import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Image from 'next/image';
import { getFormattedDate } from "../../functions/get_formatted_date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getLatestDate } from "../../functions/get_latest_date";
import { getNoteListSortedByItemCreatedAt } from "../../functions/get_note_list_sorted_by_item_created_at";
import { useState } from "react";
import { NoteCreateModal } from '../../components/notes/note_create.modal';
import { BreadCrumbs } from "../../components/breadcrumbs";
import { revalidateTime } from "../../lib/revalidate_time";
import { NoteWithUserAndItems } from "../../types/note";

const Notes = (props: Props) => {
    const [ notes, setNotes ] = useState<NoteWithUserAndItems[]>(getNoteListSortedByItemCreatedAt(props.notes));
    const [ modalOpen, setModalOpen ] = useState<boolean>(false);

    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                width: "100%"
            },
            icon: {
                fontSize: "1.2em"
            }
        })
    );
    const classes = useStyles();

    return (
        <>
            <BreadCrumbs
                current="ノート一覧"
            />
            <div className="text-right">
                <IconButton
                    onClick={() => setModalOpen(true)}
                    className={classes.icon}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </IconButton>
            </div>
            <List>
                {notes.map(note =>
                    <Link href={`/items/${note.id}`} key={note.id} passHref>
                        <Button className={classes.button}>
                            <ListItem key={note.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Image src={note.user.image!} layout="fill" loading="lazy" alt="作成者の画像" />
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
                                            {note.items.length ?
                                                <>
                                                    <FontAwesomeIcon icon={faPen} className="mr-1" />
                                                    {getFormattedDate(getLatestDate(note.items.map(item => item.createdAt)))}
                                                </>
                                            : ""}
                                        </>
                                    }
                                    />
                            </ListItem>
                        </Button>
                    </Link>
                )}
            </List>
            <NoteCreateModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
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
        },
        revalidate: revalidateTime
    }
}

interface Props {
    notes: NoteWithUserAndItems[]
}

export default Notes;