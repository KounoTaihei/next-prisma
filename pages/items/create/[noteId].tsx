import { Button, CircularProgress, TextareaAutosize, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Note } from "@prisma/client";
import axios from "axios";
import { Formik } from "formik";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import * as Yup from 'yup';
import prisma from '../../../lib/prisma';

const apiUrl = process.env.API_URL + "/items";

const CreateItem = ({ note }: Props) => {
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    const [ previewUrls, setPreviewUrls ] = useState<string[]>([]);

    function setPreview(event: any){
        const imageFile = event.target?.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setPreviewUrls([ ...previewUrls, imageUrl ]);
    }

    const initialValues: {
        noteId: string
        title : string
        body : string
    } = {
        noteId: note.id,
        title: "",
        body: "",
    }

    const validationSchema = Yup.object().shape({
        body: Yup.string().max(200, '200文字以内で入力してください').required('入力必須です')
    });

    if(submitting) {
        return <CircularProgress />
    }

    if(!submitting) {
        return (
            <>
                <div>{note.title}のアイテムを追加</div>
                <Formik
                    initialValues = {initialValues}
                    validationSchema = {validationSchema}
                    onSubmit = {async (values) => {
                        setSubmitting(true);
                        await axios.post(`${apiUrl}/note/${note.id}`, values)
                        .then(() => {
                            router.push(`/items/note/${note.id}`);
                        })
                        .catch(err => {
                            setSubmitting(false);
                            console.log(err);
                        });
                    }}
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
                                <div className="w-96 my-2">
                                    <TextField
                                        label="タイトル"
                                        placeholder="必須ではありません"
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                    />
                                </div>
                                <div className="w-96 my-2">
                                    <TextareaAutosize
                                        placeholder="本文"
                                        name="body"
                                        aria-label="minimum height"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.body}
                                        minRows={4}
                                        className="border w-full"
                                    />
                                    {errors.body && touched.body && <Alert severity="error">入力必須です</Alert>}
                                </div>
                                <div className="w-96">
                                    <img src={previewUrls[0]} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                        onChange={setPreview}
                                    />
                                </div>
                            </div>
                            <div className="m-2">
                                <Button variant="outlined" onClick={handleReset}>
                                    キャンセル
                                </Button>
                                <Button variant="outlined" color="primary" type="submit" disabled={isSubmitting}>
                                    作成
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </>
        )
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes: Note[] = await prisma.note.findMany();
    const paths = notes.map(note => `/items/create/${note.id}`);

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.noteId?.toString();
    const note: Note | null = await prisma.note.findUnique({
        where: { id }
    })
    .then(res => JSON.parse(JSON.stringify(res)));

    return {
        props: { note }
    }
}

interface Props {
    note: Note
}

export default CreateItem;