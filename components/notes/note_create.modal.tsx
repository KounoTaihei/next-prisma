import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, makeStyles, TextField } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from 'yup';

const apiUrl = '/api/notes';

export const NoteCreateModal = ({
    modalOpen,
    setModalOpen
}: Props) => {
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
            progress: {
                margin: "30px"
            },
            textField: {
                width: "100%",
                margin: "0.5em 0"
            },
            actions: {
                justifyContent: "space-evenly"
            }
        })
    );
    const classes = useStyles();

    const handleClose = () => {
        setModalOpen(false);
    };

    const initialValues: FormValues = {
        title: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(50, '50文字以内で入力してください').required('入力必須です')
    });

    const submit = async (values: FormValues) => {
        setSubmitting(true);
        await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then((res) => {
            setSubmitting(false);
            res.json().then(r => {
                router.push(`/items/${r.id}`)
            })
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
                        新規ノートを作成
                        <IconButton onClick={handleClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </IconButton>
                    </DialogContentText>
                    <Formik
                        initialValues = {initialValues}
                        validationSchema = {validationSchema}
                        onSubmit = {submit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            handleReset
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <TextField
                                        error={errors.title && touched.title ? true : false}
                                        helperText={errors.title && touched.title ? errors.title : ""}
                                        label="タイトル"
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                        className={classes.textField}
                                    />
                                    <span className="text-red-400">
                                        {errors.title && touched.title}
                                    </span>
                                </div>
                                <div>
                                    <DialogActions className={classes.actions}>
                                        <Button variant="outlined" onClick={handleReset}>
                                            入力をクリア
                                        </Button>
                                        <Button variant="outlined" color="primary" type="submit" disabled={isSubmitting}>
                                            作成
                                        </Button>
                                    </DialogActions>
                                </div>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
            )}
        </Dialog>
    )
}

interface FormValues {
    title: string
}

interface Props {
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>
}