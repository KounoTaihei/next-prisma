import { Note } from ".prisma/client";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/styles";
import { Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction, useState } from "react";
import * as Yup from 'yup';
import { getFormattedDate } from "../../../functions/get_formatted_date";
import { Loader } from "../loader";
import { postImage } from "../../pages/api/upload";

const apiUrl = '/api/items';

export const ItemCreateModal = ({ note, modalOpen, setModalOpen }: Props) => {
    const [ forRender, setForRender ] = useState<boolean>(false);
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    const [ image, setImage ] = useState<File | null>(null);
    const [ createObjectUrl, setCreateObjectUrl ] = useState<string | null>(null);

    /** ファイルのプレビュー用 */
    const uploadToClient = (event: any) => {
        if(event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            setImage(file);
            setCreateObjectUrl(URL.createObjectURL(file));
        }
    }

    /** サーバーサイドにアップロード */
    const uploadToServer = async() => {
        if(image) {
            const result = await postImage(image);
            return await result;
        } else {
            alert('画像を１枚以上追加してください。')
        }
    }

    const useStyles = makeStyles(() =>
        createStyles({
            dialogTitle: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#000",
                margin: 0
            },
            textField: {
                width: "100%",
                margin: "0.2em 0"
            },
            actions: {
                justifyContent: "space-evenly"
            },
            button: {
                fontSize: "0.8em",
                padding: "0.4em"
            }
        })
    );
    const classes = useStyles();

    const initialValues: FormValues= {
        title: "",
        body: "",
        image: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(20, '20文字以内で入力してください').required('入力必須です'),
        body: Yup.string().max(200, '200文字以内で入力してください').required('入力必須です')
    });

    const handleClose = () => {
        setModalOpen(false);
    }

    const submit = async (values: FormValues) => {
        setSubmitting(true);
        await uploadToServer().then(res => {
            values.image = res!;
            fetch(`${apiUrl}/${note.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
        })
        .then((res) => {
            setSubmitting(false);
            setModalOpen(false);
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
                        {note.title} の投稿を追加
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
                            isSubmitting
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="p-2">
                                    <div className="text-right">
                                        <TextField
                                            label="タイトル"
                                            type="text"
                                            name="title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.title}
                                            error={errors.title && touched.title ? true : false}
                                            helperText={errors.title && touched.title ? "入力必須です" : ""}
                                            className={classes.textField}
                                        />
                                        <button
                                            onClick={() => {
                                                values.title = `${getFormattedDate(new Date())}の投稿`;
                                                setForRender(!forRender);
                                            }}
                                            className="border-2 px-2 rounded-xl text-sm"
                                        >
                                            デフォルト文章
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <TextField
                                            id="standard-multiline-static"
                                            label="本文"
                                            name="body"
                                            multiline
                                            rows={4}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.body}
                                            error={errors.body && touched.body ? true : false}
                                            helperText={errors.body && touched.body ? "入力必須です" : ""}
                                            className={classes.textField}
                                        />
                                        <button
                                            onClick={() => {
                                                values.body = "入力が面倒な時に使う";
                                                setForRender(!forRender);
                                            }}
                                            className="border-2 px-2 rounded-xl text-sm"
                                        >
                                            デフォルト文章
                                        </button>
                                    </div>
                                    <div className="text-center items-center my-4">
                                        <input type="file" onChange={uploadToClient} className="my-2" />
                                        <img src={createObjectUrl!} />
                                    </div>
                                </div>
                                <div>
                                    <DialogActions className={classes.actions}>
                                        <Button variant="outlined"
                                            onClick={() => {
                                                values.title = "",
                                                values.body = "",
                                                setImage(null);
                                                setCreateObjectUrl(null);
                                                setForRender(!forRender);
                                            }}
                                        >
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
    title : string
    body : string
    image: string | undefined
}

interface Props {
    note: Note
    modalOpen: boolean
    setModalOpen: Dispatch<SetStateAction<boolean>>
}