import { User } from "@prisma/client";
import axios from "axios";
import { Formik } from "formik";
import { GetStaticProps } from "next";
import * as Yup from 'yup';
import { API_URL } from "../../environments/environments";

const apiUrl = API_URL + "/threads";

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
                            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" type="button" onClick={handleReset}>
                                Clear
                            </button>
                            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" type="submit" disabled={isSubmitting}>
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    )
}

export default CreateThread;