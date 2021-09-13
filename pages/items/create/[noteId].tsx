import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Note } from "@prisma/client";
import axios from "axios";
import { Formik } from "formik";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import * as Yup from 'yup';
import prisma from '../../../lib/prisma';

const apiUrl = `${process.env.API_URL}/items`;

const CreateItem = ({ note }: Props) => {
    const router = useRouter();
    const [ submitting, setSubmitting ] = useState<boolean>(false);

    const [ previewUrl_1, setPreviewUrl_1 ] = useState<string>("");
    // const [ previewUrl_2, setPreviewUrl_2 ] = useState<string>("");
    // const [ previewUrl_3, setPreviewUrl_3 ] = useState<string>("");
    // const [ previewUrl_4, setPreviewUrl_4 ] = useState<string>("");

    function setPreview_1(event: any){
        const imageFile = event.target?.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        setPreviewUrl_1(imageUrl);
    }

    // function setPreview_2(event: any){
    //     const imageFile = event.target?.files[0];
    //     const imageUrl = URL.createObjectURL(imageFile);
    //     setPreviewUrl_2(imageUrl);
    // }

    // function setPreview_3(event: any){
    //     const imageFile = event.target?.files[0];
    //     const imageUrl = URL.createObjectURL(imageFile);
    //     setPreviewUrl_3(imageUrl);
    // }

    // function setPreview_4(event: any){
    //     const imageFile = event.target?.files[0];
    //     const imageUrl = URL.createObjectURL(imageFile);
    //     setPreviewUrl_4(imageUrl);
    // }

    const initialValues: {
        noteId: string
        title : string
        body : string
        image_1: string | null
        image_2: string | null
        image_3: string | null
        image_4: string | null
    } = {
        noteId: note.id,
        title: "",
        body: "",
        image_1: null,
        image_2: null,
        image_3: null,
        image_4: null
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
                                    />
                                </div>
                                <div className="text-center flex items-center">
                                    <div className="w-96">
                                        <img src={previewUrl_1} className="py-4 mx-auto" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="image_1"
                                            onChange={setPreview_1}
                                        />
                                    </div>
                                    {/* <div className="w-96">
                                        <img src={previewUrl_2} className="py-4 mx-auto" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="image_2"
                                            onChange={setPreview_2}
                                        />
                                    </div> */}
                                </div>
                            </div>
                            <div className="m-2">
                                <Button variant="outlined" onClick={handleReset}>
                                    入力をクリア
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