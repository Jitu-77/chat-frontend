import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    // navigate("/dashboard");
    // try {
    //   const res = await api.post("/auth/login", {
    //     email,
    //     password,
    //   });
    //   console.log(res.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Login to your account
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border rounded-xl px-4 py-2 focus:outline-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border rounded-xl px-4 py-2 focus:outline-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
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
      </div>
    </AuthLayout>
  );
};

export default Login;
