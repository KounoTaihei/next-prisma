import { Button, CircularProgress, TextareaAutosize } from "@material-ui/core";
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

    const [ imageQuantity, setImageQuantity ] = useState<number>(0);
    const [ previewUrls, setPreviewUrls ] = useState<string[]>([]);

    function setPreview(event: any){
        const imageFile = event.target?.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setPreviewUrls([ ...previewUrls, imageUrl ]);
    }

    const initialValues = {
        noteId: note.id,
        body:"",
        image: []
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
                                <div className="w-96">
                                    <TextareaAutosize
                                        placeholder="本文を入力してください"
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
                                    <div>
                                    {imageQuantity}
                                    <button onClick={() => setImageQuantity(imageQuantity + 1)}>プラス</button>
                                    <button onClick={() => setImageQuantity(imageQuantity - 1)}>マイナス</button>
                                    </div>
                                </div>
                            </div>
                            <div className="m-2">
                                <Button variant="outlined" onClick={handleReset}>
                                    Clear
                                </Button>
                                <Button variant="outlined" color="primary" type="submit" disabled={isSubmitting}>
                                    Create
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