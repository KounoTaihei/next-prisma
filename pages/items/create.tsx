import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from 'yup';

const apiUrl = process.env.API_URL + "/items";

const CreateItem = () => {
    const initialValues = {
        title: "",
        body:""
    }

    const validationSchema = Yup.object().shape({
        body: Yup.string().max(200, '200文字以内で入力してください').required('入力必須です')
    });

    return (
        <>
            <Formik
                initialValues = {initialValues}
                validationSchema = {validationSchema}
                onSubmit = {async (values) => {
                    const res = await axios.post(apiUrl, values);
                    console.log(res.data);
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
                                    label="タイトル"
                                    type="text"
                                    name="title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                            </div>
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

export default CreateItem;