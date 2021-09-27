import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { getFormattedDate } from "../../functions/get_formatted_date";
import { NoteWithUserAndItems } from "../../types/note";
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { getLatestDate } from "../../functions/get_latest_date";
import { createStyles, makeStyles } from "@material-ui/styles";

export const NoteItem = ({ note, header }: Props) => {
    const useStyles = makeStyles(() =>
        createStyles({
            button: {
                width: "100%"
            },
            headerButton: {
                width: "100%",
                padding: "0"
            },
            headerList: {
                padding: "0.8rem"
            }
        })
    );
    const classes = useStyles();

    return (
        <Link href={`/items/${note.id}`} passHref>
            <Button className={header ? classes.headerButton : classes.button}>
                <ListItem className={header ? classes.headerList : ""}>
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
                                {note.user.name}が{getFormattedDate(note.createdAt)}に作成<br></br>
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
    )
}

interface Props {
    note: NoteWithUserAndItems
    header?: boolean
}