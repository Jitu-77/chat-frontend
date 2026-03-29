// import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiService } from "../api/apiService";
const Signup = () => {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const navigate = useNavigate();
  // const handleSignUp = async () => {
  //   navigate("/signup");
  // };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      nickName: "",
      // profilePic: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      nickName: Yup.string().required("Nick Name is required"),
      // profilePic: Yup.string().required("Profile Picture is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
      console.log("SIGNUP FORM", values);
      const response :any = await apiService.post("/auth/signup", values);
      console.log(response);
      navigate("/login");     
      } catch (error) {
        console.error(error);
      }

    },
  });
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">Create an account</h2>

      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="border rounded-xl px-4 py-2 focus:outline-primary"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.firstName}
            </p>
          )}
        </>
        <>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="border rounded-xl px-4 py-2 focus:outline-primary"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.lastName}
            </p>
          )}
        </>

        <>
          <input
            type="text"
            name="nickName"
            placeholder="Nick Name"
            className="border rounded-xl px-4 py-2 focus:outline-primary"
            value={formik.values.nickName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.nickName && formik.errors.nickName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.nickName}
            </p>
          )}
        </>
        <>
          <input
            type="text"
            name="password"
            placeholder="Last Name"
            className="border rounded-xl px-4 py-2 focus:outline-primary"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </>

        <button
          className="bg-primary text-white py-2 rounded-xl hover:bg-primaryDark"
          type="submit"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
