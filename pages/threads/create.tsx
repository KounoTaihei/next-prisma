import { Button } from "@material-ui/core";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from 'yup';

const apiUrl = process.env.API_URL + "/threads";

const CreateThread = () => {
    const initialValues = {
        title: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().max(50, '50文字以内で入力してください').required('入力必須です')
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
                            <label htmlFor="title">Title</label>
                            <div>
                                <input
                                type="text"
                                name="title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <span className="text-red-400">
                                {errors.title && touched.title}
                            </span>
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

export default CreateThread;