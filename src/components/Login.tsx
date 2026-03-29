// import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiService } from "../api/apiService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      password: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("FirstName is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async(values) => {
      try {
        console.log("LOGIN FORM",values);
        const res :any = await apiService.post("/auth/login", values);
        console.log(res);
        login({
           user: res.user,
           token: res.accessToken,
        });
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    },
  });
  // const handleLogin = async () => {
  //   navigate("/dashboard");
  //   // try {
  //   //   const res = await api.post("/auth/login", {
  //   //     email,
  //   //     password,
  //   //   });
  //   //   console.log(res.data);
  //   // } catch (err) {
  //   //   console.error(err);
  //   // }
  // };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login to your account
      </h2>

      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <>
          <input
            type="firstName"
            name="firstName"
            placeholder="First Name"
            className="border rounded-xl px-4 py-2 focus:outline-primary"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.firstName}</p>
          )}
        </>

        <>
          <input
            type="password"
            name="password"
            placeholder="Password"
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
          type="submit"
          className="bg-primary text-white py-2 rounded-xl hover:bg-primaryDark"
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
