import { Note } from ".prisma/client";
import { faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction, useState } from "react";
import { API_URL } from "../../lib/api";

const apiUrl = API_URL;

export const NoteDeleteModal = ({
    note,
    itemsLength,
    modalOpen,
    setModalOpen,
}: Props ) => {
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    const useStyles = makeStyles(() =>
        createStyles({
            dialogTitle: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#000",
                margin: 0
            },
            alertMessage: {
                color: "red",
                fontSize: "0.8em",
                textAlign: "center"
            },
            icon: {
                margin: "0 5px",
                fontSize: "1em"
            },
            progress: {
                margin: "30px"
            },
            actions: {
                justifyContent: "space-evenly"
            }
        })
    );
    const classes = useStyles();

    const handleClose = () => {
        setModalOpen(false);
    }

    const deleteNote = async () => {
        setSubmitting(true);
        await axios.delete(`${apiUrl}/notes/${note.id}`).then(() => {
            router.push('/notes');
        })
        .catch(err => {
            setSubmitting(false);
            console.log(err);
        });
    }

    const deleteAllItems = async () => {
        if(!confirm('本当に削除しますか？')) {
            return;
        }
        setSubmitting(true);
        await axios.delete(`${apiUrl}/items/all/${note.id}`).then(() => {
            router.reload();
        })
        .catch(err => {
            setSubmitting(false);
            console.log(err);
        });
    }

    return (
        <Dialog
            open={modalOpen}
            onClose={handleClose}
        >
            {submitting ? (
                <DialogContent>
                    <CircularProgress className={classes.progress} />
                </DialogContent>
            ) : (
                <DialogContent>
                    <DialogContentText className={classes.dialogTitle}>
                        ノートを削除（{note.title}）
                        <IconButton onClick={handleClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    </DialogContentText>
                    {itemsLength > 0 && (
                        <DialogContentText className={classes.alertMessage}>
                            <FontAwesomeIcon icon={faExclamationCircle} className={classes.icon} />
                            アイテムが追加されている為削除できません。
                        </DialogContentText>
                    )}
                    <DialogActions className={classes.actions}>
                        <Button variant="outlined" onClick={() => setModalOpen(false)}>
                            戻る
                        </Button>
                        {itemsLength > 0 ? (
                            <Button variant="outlined" color="secondary" type="submit" disabled={submitting} onClick={deleteAllItems}>
                                アイテムを全て削除
                            </Button>
                        ) : (
                            <Button variant="outlined" color="secondary" type="submit" disabled={submitting} onClick={deleteNote}>
                                削除
                            </Button>
                        )}
                    </DialogActions>
                </DialogContent>
            )}
        </Dialog>
    )
}

interface Props {
    note: Note
    itemsLength: number
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>
}