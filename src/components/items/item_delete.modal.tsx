import { Item } from ".prisma/client";
import { faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteImage } from "../../pages/api/image/delete";
import { Loader } from "../loader";

export const ItemDeleteModal = ({
    item,
    modalOpen,
    setModalOpen
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
            actions: {
                justifyContent: "space-evenly"
            }
        })
    );
    const classes = useStyles();

    const handleClose = () => {
        setModalOpen(0);
    }

    const deleteItem = async () => {
        setSubmitting(true);
        await fetch(`/api/items/item/${item.id}`, {
            method: 'DELETE'
        }).then(() => {
            deleteImage(item.image);
        })
        .then(() => {
            setModalOpen(0);
            setSubmitting(false);
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
                    <div className="m-10">
                        <Loader />
                    </div>
                </DialogContent>
            ) : (
                <DialogContent>
                    <DialogContentText className={classes.dialogTitle}>
                        投稿を削除（{item.title}）
                        <IconButton onClick={handleClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    </DialogContentText>
                    <DialogActions className={classes.actions}>
                        <Button variant="outlined" onClick={() => setModalOpen(0)}>
                            戻る
                        </Button>
                        <Button variant="outlined" color="secondary" type="submit" disabled={submitting} onClick={deleteItem}>
                            削除
                        </Button>
                    </DialogActions>
                </DialogContent>
            )}
        </Dialog>
    )
}

interface Props {
    item: Item
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<number>>
}