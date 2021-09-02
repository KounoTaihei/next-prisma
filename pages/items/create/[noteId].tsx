import { Button, TextField } from "@material-ui/core";
import { Note } from "@prisma/client";
import axios from "axios";
import { Formik } from "formik";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/dist/client/router";
import * as Yup from 'yup';
import prisma from '../../../lib/prisma';

const apiUrl = process.env.API_URL + "/items";

const CreateItem = ({ note }: Props) => {
    const router = useRouter();

    const initialValues = {
        body:"",
        noteId: note.id
    }

    const validationSchema = Yup.object().shape({
        body: Yup.string().max(200, '200文字以内で入力してください').required('入力必須です')
    });

    return (
        <>
            <div>{note.title}のアイテムを追加</div>
            <Formik
                initialValues = {initialValues}
                validationSchema = {validationSchema}
                onSubmit = {async (values) => {
                    await axios.post(`${apiUrl}/note/${note.id}`, values);
                    router.push(`/items/note/${note.id}`);
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
                            <div>
                                <TextField
                                    error={errors.body && touched.body ? true : false}
                                    helperText={errors.body && touched.body ? errors.body : ""}
                                    label="本文"
                                    type="text"
                                    name="body"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.body}
                                />
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